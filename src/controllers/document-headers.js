const HAPIRestAPI = require('@envage/hapi-pg-rest-api');
const Joi = require('joi');
const { pool } = require('../lib/connectors/db');
const { version } = require('../../config');

/**
 * Function to map a data row from the roles table into a mongo-sql
 * style query
 * @todo may need work if supporting user who can use all regimes
 * @param {Object} row - from entity_roles table
 * @return {Object} mongo-sql query for document_header table
 */
/* eslint-disable camelcase */
function mapRole (row) {
  const { regime_entity_id, company_entity_id } = row;

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
    },
    {
      'metadata->>Name': {
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
async function getEntityFilter (mode, value, roles = null) {
  let query;
  const params = [value];
  if (mode === 'email') {
    query = `SELECT r.* FROM crm.entity e
              JOIN crm.entity_roles r ON e.entity_id=r.entity_id
              WHERE LOWER(e.entity_nm)=LOWER($1) AND e.entity_type='individual' `;
  }
  if (mode === 'individual') {
    // individual entity ID
    query = 'SELECT * FROM crm.entity_roles r WHERE entity_id=$1';
  }
  if (roles) {
    const roleStr = roles.map((role, i) => (`$${params.length + i + 1}`)).join(',');
    query += ` AND r.role IN ( ${roleStr} )`;
    params.push(...roles);
  }

  const { rows, error } = await pool.query(query, params);
  if (error) {
    throw error;
  }
  if (rows.length === 0) {
    return { $or: { company_entity_id: 'no-company-entity-found' } };
  }
  return { $or: rows.map(mapRole) };
}

/**
 * Given the supplied 'result' from hapi-pg-rest-api hook, gets the filter to use
 * This is for backwards-compatibility with the original POST API, and allows
 * documents to be filtered by the user's roles
 * @type {Object} hapi-pg-rest-api result
 * @return {Promise} resolves with filter for query on document headers table
 */
const getPreQueryFilter = async (result) => {
  const { string, email, roles, entity_id: entityId, includeExpired = false, ...filter } = result.filter;

  // don't include soft deleted records
  if (!includeExpired) {
    filter.date_deleted = null;
  }

  // Only display current licences
  if (!includeExpired) {
    filter['metadata->>IsCurrent'] = { $ne: 'false' };
  }

  // Search by string - can be licence number/name
  if (string) {
    filter.$or = getSearchFilter(string);
  };

  // Search by entity ID / entity email address (can be combined)
  if (email) {
    filter.$and = [];
    filter.$and.push(await getEntityFilter('email', email, roles));
  }

  if (entityId) {
    filter.$and = filter.$and || [];
    filter.$and.push(await getEntityFilter('individual', entityId, roles));
  }

  return filter;
};

/**
 * Given the supplied 'result' from hapi-pg-rest-api hook, gets the sort object to use
 * This is for backwards-compatibility with the original POST API
 * @type {Object} hapi-pg-rest-api result
 * @return {Object} sort object for query on document headers table
 */
const getPreQuerySort = (result) => {
  const { document_expires: documentExpires, ...sort } = result.sort || {};
  if (documentExpires) {
    sort['metadata->>Expires'] = documentExpires;
  }
  return sort;
};

/**
 * Pre-query hook for document headers
 * @param  {Object} result      hapi-pg-rest-api pre-query result object
 * @param  {Object} hapiRequest the current HAPI request instance
 * @return {Promise}            resolves with modified hapi-pg-rest-api pre-query result
 */
async function preQuery (result, hapiRequest) {
  const filter = await getPreQueryFilter(result);
  const sort = await getPreQuerySort(result);
  return {
    ...result,
    filter,
    sort
  };
}

const documentHeadersApi = new HAPIRestAPI({
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
    verification_id: Joi.string().guid().allow(null),
    document_name: Joi.string().allow(null)
  }
});

module.exports = documentHeadersApi;

module.exports.getSearchFilter = getSearchFilter;
