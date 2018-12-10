/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Boom = require('boom');
const uuidv4 = require('uuid/v4');
const DB = require('./connectors/db');
const entityRoleApi = require('../controllers/entity-roles');
const { pool } = require('./connectors/db');
const logger = require('./logger');

function setDocumentOwner (request, h) {
  const guid = uuidv4();
  const query = `
    update crm.document_header
    set company_entity_id=$1
    where document_id=$2`;

  const queryParams = [
    request.payload.entity_id,
    request.params.document_id,
    guid
  ];

  request.log('info', query);
  request.log('info', queryParams);

  return DB.query(query, queryParams)
    .then((res) => {
      return {
        error: res.error,
        document_id: request.params.document_id
      };
    });
}

function getColleagues (request, h) {
  request.log('info', request.query);
  const entityId = request.params.entity_id;
  /**
  identify user roles who the supplied user can admin
    i.e. users with a different entity id who have role that have the same company
  **/

  let query = `  select
  distinct
  grantee_role.entity_role_id,
  grantee_role.entity_id as individual_entity_id,
  entity.entity_nm,
  grantee_role.role,
  grantee_role.regime_entity_id,
  grantee_role.company_entity_id,
  grantee_role.created_at,
  grantee_role.created_by
  from crm.entity_roles grantee_role
  join crm.entity_roles granter_role on (
  (
   granter_role.regime_entity_id = grantee_role.regime_entity_id and
   granter_role.company_entity_id is null
  )
  or
  (
   granter_role.company_entity_id = grantee_role.company_entity_id
  )
  )
  join crm.entity entity on (
   grantee_role.entity_id = entity.entity_id
  )

where
 granter_role.role='primary_user'
and
  grantee_role.entity_id !=$1
  and
  granter_role.entity_id = $1
    `;

  const queryParams = [entityId];
  if (request.query.direction === 1) {
    query += ' order by ' + request.query.sort + ' asc';
  } else {
    query += ' order by ' + request.query.sort + ' desc';
  }

  return DB.query(query, queryParams)
    .then((res) => {
      return res.data;
    }).catch((err) => {
      logger.error('getColleagues error', err);
      return h.response(err);
    });
}

/**
 * DB query to delete colleague role
 * @param {String} roleId - GUID
 * @param {String} entityid - GUID
 * @return {Promise}
 */
const deleteColleagueQuery = (roleId, entityId) => {
  const query = `DELETE
FROM crm.entity_roles r
USING crm.entity_roles r2
WHERE r.entity_role_id=$1
AND r.company_entity_id=r2.company_entity_id
AND (r.regime_entity_id=r2.regime_entity_id OR (r.regime_entity_id IS NULL AND r2.regime_entity_id IS NULL))
AND r2.entity_id=$2 AND r2.role='primary_user'
RETURNING r.*`;

  const params = [roleId, entityId];

  return pool.query(query, params);
};

/**
 * @param {String} request.params.entity_id the entity ID of the primary user
 * @param {String} request.params.role_id the role ID to delete
 */
const deleteColleague = async(request, h) => {
  const { entity_id: entityId, role_id: roleId } = request.params;

  const { rows: [data], error, rowCount } = await deleteColleagueQuery(roleId, entityId);

  // SQL error
  if (error) {
    return h.response({
      error,
      data: null
    }).code(500);
  }
  // No role deleted
  if (rowCount !== 1) {
    return h.response({
      error: 'Role not found',
      data: null
    }).code(404);
  }
  // OK
  return {
    error: null,
    data
  };
};

/**
 * Creates a new entity role for a colleague.
 *
 * This role will give access to the relevant data across the company
 * or regime that the granting user has.
 *
 * The request should contain the granting users entity id in the
 * URL parameter, and the `colleague_entity_id` and the `role` in
 * the request payload.
 *
 * Expected `role` values are: 'user' | 'user_returns'.
 * An empty role value will default to 'user'.
 * */
async function createColleague (request, h) {
  const entityID = request.params.entity_id;
  const { role, colleagueEntityID } = request.payload;

  const { rows: [primaryUserRole] } = await entityRoleApi.repo.find({ entity_id: entityID, role: 'primary_user' });

  if (!primaryUserRole) {
    throw Boom.unauthorized(`Only a primary user can grant access`, {role, colleagueEntityID});
  }

  const { regime_entity_id: userRegimeID, company_entity_id: userCompanyID } = primaryUserRole;
  const entityRoleID = uuidv4();

  const query = `
    insert into crm.entity_roles(
      entity_role_id, entity_id, role, regime_entity_id,
      company_entity_id, created_at, created_by
    )
    values ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, $6)
    on conflict (entity_id, coalesce(regime_entity_id, '00000000-0000-0000-0000-000000000000'), company_entity_id, role)
    do nothing
    returning *
    ;`;

  const params = [entityRoleID, colleagueEntityID, role, userRegimeID, userCompanyID, entityID];

  const { rows: [data], error } = await pool.query(query, params);

  return h.response({ data, error }).code(error ? 500 : 201);
}

module.exports = {
  setDocumentOwner,
  getColleagues,
  deleteColleague,
  createColleague
};
