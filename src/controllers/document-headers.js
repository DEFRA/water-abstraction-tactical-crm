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
function mapRole (row) {
  const {regime_entity_id, company_entity_id} = row;

  return company_entity_id
    ? { company_entity_id }
    : { regime_entity_id };
}

/**
 * Get search filter from string
 * @param {String} string
 * @return {Promise} resolves with mongo-sql
 */
const getSearchFilter = (string) => {
 return [
     {
       system_external_id : {
         $ilike : `%${ string }%`
       }
     },
     {
       document_name : {
         $ilike : `%${ string }%`
       }
     }
   ];
}

/**
 * Gets a list of roles from the DB for supplied email address
 * @param {String} email
 * @return {Array} entity_role records
 */
async function getRolesForEmail(email) {
  const query = `SELECT r.* FROM crm.entity e
            JOIN crm.entity_roles r ON e.entity_id=r.entity_id
            WHERE LOWER(e.entity_nm)=LOWER($1) AND e.entity_type='individual' `;
  const { rows, error } = await pool.query(query, [email]);
  if(error) {
    throw error;
  }
  return rows;
}

/**
 * Get roles for entity ID
 * @params {String} entityId - individual
 * @return {Array} entity_role records
 */
 async function getRolesForIndividual(entityId) {
   const query = `SELECT * FROM crm.entity_roles WHERE entity_id=$1`;
   let { rows, error } = await pool.query(query, [entityId]);
   if(error) {
     throw error;
   }
   return rows;
 }



/**
 * Get email filter from email string
 * @param {String} email
 * @return {Promise} resolves with mongo-sql query fragment
 */
const getEmailFilter = async (email) => {
  const emailRoles = await getRolesForEmail(email);
  if(emailRoles.length === 0) {
    return {$or : {company_entity_id : 'no-entity-found-with-email'}};
  }
  return { $or : emailRoles.map(mapRole) };
}

/**
 * Get entity filter from individual entity ID GUID
 * @param {String} entityId - GUID
 * @return {Promise} resolves with mongo-sql query fragment
 */
const getEntityFilter = async (entityId) => {
  const entityRoles = await getRolesForIndividual(entityId);
  if(entityRoles.length === 0) {
    return {$or : {company_entity_id : 'no-entity-found-with-id'}};
  }
  return { $or : entityRoles.map(mapRole) };
}


async function preQuery (result, hapiRequest) {

 const { string, email, entity_id : entityId, ...filter } = result.filter;
 const { document_expires, ...sort } = result.sort;

 // Search by string - can be licence number/name
 if(string) {
   filter.$or = getSearchFilter(string);
 };

 // Search by entity ID / entity email address (can be combined)
 if(email) {
   filter.$and = [];
   filter.$and.push(await getEmailFilter(email));
 }

 if(entityId) {
   filter.$and = filter.$and || [];
   filter.$and.push(await getEntityFilter(entityId));
 }

 // Rewrite sort
 if(document_expires) {
   sort["metadata->>Expires"] = document_expires;
 }

 result.filter = filter;
 result.sort = sort;

 console.log(JSON.stringify(result, null, 2));

 return result;
}


module.exports = (config = {}) => {
  const {pool, version} = config;

  return new HAPIRestAPI({
    table : 'crm.document_header',
    primaryKey : 'document_id',
    endpoint : '/crm/' + version + '/documentHeader',
    connection : pool,

    upsert : {
      fields : ['system_id', 'system_internal_id', 'regime_entity_id'],
      set : ['system_external_id', 'metadata']
    },

    preQuery,

    validation : {
      document_id : Joi.string().guid(),
      regime_entity_id : Joi.string().guid(),
      system_id : Joi.string(),
      system_internal_id : Joi.string(),
      system_external_id : Joi.string(),
      metadata : Joi.string(),
      company_entity_id : Joi.string().guid().allow(null),
      verified : Joi.number().allow(null),
      verification_id : Joi.string().guid().allow(null),
      document_name : Joi.string()
    }
  });
}
