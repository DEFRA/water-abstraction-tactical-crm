const HAPIRestAPI = require('@envage/hapi-pg-rest-api')
const Joi = require('joi')
const { get } = require('lodash')
const { version } = require('../../config')
const { pool } = require('../lib/connectors/db')
const { groupBy, reduce } = require('lodash')
const Boom = require('@hapi/boom')

const isIndividual = entity => {
  return get(entity, 'entity_type', '').toLowerCase() === 'individual'
}

const lowerCaseEntityName = entity => {
  const name = get(entity, 'entity_nm', '')

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
  return reduce(
    groupBy(rows, 'company_entity_id'),
    (acc, companyRows) => {
      const company = reduce(companyRows, (companyAcc, row) => {
        companyAcc.userRoles.push(row.role)
        companyAcc.entityId = row.company_entity_id
        companyAcc.name = row.company_name
        return companyAcc
      }, { userRoles: [] })

      return [...acc, company]
    },
    []
  )
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
