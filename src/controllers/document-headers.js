const HAPIRestAPI = require('hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../lib/connectors/db');

/**
 * Function to map a data row from the roles table into a mongo-sql
 * style query
 * @todo may need work if supporting user who can use all regimes
 * @param {Object} row - from entity_roles table
 * @return {Object} mongo-sql query for document_header table
 */
/* eslint-disable camelcase */
function mapRole (row) {
  const {regime_entity_id, company_entity_id} = row;

  return company_entity_id
    ? { company_entity_id }
    : { regime_entity_id };
}
/* eslint-enable camelcase */

/**
 * Get search filter from string
 * @param {String} string
 * @return {Promise} resolves with mongo-sql
 */
const getSearchFilter = (string) => {
  return [
    {
      system_external_id: {
        $ilike: `%${string}%`
      }
    },
    {
      document_name: {
        $ilike: `%${string}%`
      }
    }
  ];
};

/**
 * Get company_entity_id query fragments for a user either by
 * individual entity ID or email
 * @param {String} mode - email|individual
 * @param {String} value - email address or company entity ID
 * @return {Promise} resolves with object - mongo-sql query fragment
 */
async function getEntityFilter (mode, value) {
  let query;
  if (mode === 'email') {
    query = `SELECT r.* FROM crm.entity e
              JOIN crm.entity_roles r ON e.entity_id=r.entity_id
              WHERE LOWER(e.entity_nm)=LOWER($1) AND e.entity_type='individual' `;
  }
  if (mode === 'individual') {
    // individual entity ID
    query = `SELECT * FROM crm.entity_roles WHERE entity_id=$1`;
  }
  const { rows, error } = await pool.query(query, [value]);
  if (error) {
    throw error;
  }
  if (rows.length === 0) {
    return { $or: { company_entity_id: 'no-company-entity-found' } };
  }
  return { $or: rows.map(mapRole) };
}

async function preQuery (result, hapiRequest) {
  console.log('preQuery!');

  const { string, email, entity_id: entityId, ...filter } = result.filter;
  const { document_expires: documentExpires, ...sort } = result.sort;

  // Only display current licences
  filter['metadata->>IsCurrent'] = { $ne: 'false' };

  // Search by string - can be licence number/name
  if (string) {
    filter.$or = getSearchFilter(string);
  };

  // Search by entity ID / entity email address (can be combined)
  if (email) {
    filter.$and = [];
    filter.$and.push(await getEntityFilter('email', email));
  }

  if (entityId) {
    filter.$and = filter.$and || [];
    filter.$and.push(await getEntityFilter('individual', entityId));
  }

  // Rewrite sort
  if (documentExpires) {
    sort['metadata->>Expires'] = documentExpires;
  }

  result.filter = filter;
  result.sort = sort;

  console.log(JSON.stringify(result.filter, null, 2));

  // console.log(JSON.stringify(result, null, 2));

  return result;
}

module.exports = (config = {}) => {
  const {pool, version} = config;

  return new HAPIRestAPI({
    name: 'documentHeaders',
    table: 'crm.document_header',
    primaryKey: 'document_id',
    endpoint: '/crm/' + version + '/documentHeader',
    connection: pool,

    upsert: {
      fields: ['system_id', 'system_internal_id', 'regime_entity_id'],
      set: ['system_external_id', 'metadata']
    },

    preQuery,

    validation: {
      document_id: Joi.string().guid(),
      regime_entity_id: Joi.string().guid(),
      system_id: Joi.string(),
      system_internal_id: Joi.string(),
      system_external_id: Joi.string(),
      metadata: Joi.string(),
      company_entity_id: Joi.string().guid().allow(null),
      verified: Joi.number().allow(null),
      verification_id: Joi.string().guid().allow(null),
      document_name: Joi.string()
    }
  });
};
