const HAPIRestAPI = require('@envage/hapi-pg-rest-api')
const Joi = require('joi')
const { version } = require('../../config')
const { pool } = require('../lib/connectors/db')
const Boom = require('@hapi/boom')

const isIndividual = entity => {
  const entityType = entity.entity_type ?? ''
  return entityType.toLowerCase() === 'individual'
}

const lowerCaseEntityName = entity => {
  const name = entity.entity_nm ?? ''

  if (name && isIndividual(entity)) {
    entity.entity_nm = name.toLowerCase()
  }
  return entity
}

const entitiesApi = new HAPIRestAPI({
  table: 'crm.entity',
  primaryKey: 'entity_id',
  endpoint: '/crm/' + version + '/entity',
  preInsert: lowerCaseEntityName,
  onCreateTimestamp: 'created_at',
  onUpdateTimestamp: 'updated_at',
  connection: pool,
  validation: {
    entity_id: Joi.string().guid(),
    entity_nm: Joi.string(),
    entity_type: Joi.string(),
    entity_definition: Joi.string(),
    source: Joi.string()
  }
})

const loadEntity = async entityId => {
  const response = await entitiesApi.repo.find({ entity_id: entityId })
  const entityResponse = { data: null, error: null }

  if (response.rowCount === 0) {
    entityResponse.error = Boom.notFound(`No entity found for ${entityId}`)
  } else {
    entityResponse.data = response.rows[0]
  }

  return entityResponse
}

const getEntityCompaniesQuery = `
    select
        er.entity_id,
        ee.entity_nm as entity_name,
        er.role,
        er.company_entity_id,
        e.entity_nm as company_name
    from crm.entity_roles er
        inner join crm.entity e
            on er.company_entity_id = e.entity_id
        inner join crm.entity ee
            on er.entity_id = ee.entity_id
    where er.entity_id = $1`

const formatEntityCompaniesResponse = rows => {
  const groupedByCompanyEntityId = rows.reduce((group, row) => {
    const { company_entity_id: companyEntityId } = row
    group[companyEntityId] = group[companyEntityId] ?? []
    group[companyEntityId].push(row)
    return group
  }, {})

  const result = Object.values(groupedByCompanyEntityId).reduce(
    (acc, companyRows) => {
      const company = companyRows.reduce((companyAcc, row) => {
        companyAcc.userRoles.push(row.role)
        companyAcc.entityId = row.company_entity_id
        companyAcc.name = row.company_name
        return companyAcc
      }, { userRoles: [] })

      acc.push(company)
      return acc
    },
    []
  )
  return result
}

entitiesApi.getEntityCompanies = async (request, h) => {
  const { entity_id: entityId } = request.params
  const entityResponse = await loadEntity(entityId)

  if (entityResponse.error) {
    return entityResponse.error
  }

  const result = await pool.query(getEntityCompaniesQuery, [entityId])

  const companies = formatEntityCompaniesResponse(result.rows)

  return {
    data: {
      entityId,
      entityName: entityResponse.data.entity_nm,
      companies
    },
    error: null
  }
}

module.exports = entitiesApi
