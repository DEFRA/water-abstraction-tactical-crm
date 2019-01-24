const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const Joi = require('joi');
const { get } = require('lodash');
const { version } = require('../../config');
const { pool } = require('../lib/connectors/db');
const { groupBy, reduce } = require('lodash');

const isIndividual = entity => {
  return get(entity, 'entity_type', '').toLowerCase() === 'individual';
};

const lowerCaseEntityName = entity => {
  const name = get(entity, 'entity_nm', '');

  if (name && isIndividual(entity)) {
    entity.entity_nm = name.toLowerCase();
  }
  return entity;
};

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
});

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
    where er.entity_id = $1`;

entitiesApi.getEntityCompanies = async (request, h) => {
  const result = await pool.query(getEntityCompaniesQuery, [request.params.entity_id]);

  if (result.rows.length > 0) {
    const companies = reduce(
      groupBy(result.rows, 'company_entity_id'),
      (acc, companyRows) => {
        const company = reduce(companyRows, (companyAcc, row) => {
          companyAcc.userRoles.push(row.role);
          companyAcc.entityId = row.company_entity_id;
          companyAcc.name = row.company_name;
          return companyAcc;
        }, { userRoles: [] });

        return [...acc, company];
      },
      []
    );

    return {
      data: {
        entityId: request.params.entity_id,
        entityName: result.rows[0].entity_name,
        companies
      },
      error: null
    };
  }
  return h.response().code(404);
};

module.exports = entitiesApi;
