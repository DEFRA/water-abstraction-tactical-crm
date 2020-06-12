/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Boom = require('@hapi/boom');
const uuidv4 = require('uuid/v4');
const { pool } = require('./connectors/db');
const entityRoleApi = require('../controllers/entity-roles');
const { logger } = require('../logger');

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

  return pool.query(query, queryParams)
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

  return pool.query(query, queryParams)
    .then((res) => {
      return res.rows;
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
const deleteColleague = async (request, h) => {
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
    throw Boom.unauthorized('Only a primary user can grant access', '', { role, colleagueEntityID });
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

/**
 * returns the number of delegated access granted by month for the current year including the % change by month
 * with the totals for the year to date and overall total
 */
const getKPIAccessRequests = async (request, h) => {
  const query = `
  SELECT date_part('month', created_at)::integer AS month,
  date_part('year', created_at)::integer as year,
  COUNT(entity_id) AS total,
  date_part('year', created_at) = date_part('year', CURRENT_DATE) AS current_year
  FROM
     (SELECT distinct entity_id, created_at FROM crm.entity_roles where role <> 'primary_user') AS tbl
     GROUP BY month, current_year, year;`;

  const { rows: data, error } = await pool.query(query);
  if (!data) {
    return Boom.notFound('entity roles data not found', error);
  }
  // sort the data in ascending order
  const sorted = data.sort((a, b) => a.year + '' + a.month - b.year + '' + b.month);
  // map the monthly data and calculate the percentage change by  month
  const monthly = sorted.reduce((acc, row, index) => {
    if (row.current_year) {
      acc.push({
        month: row.month,
        total: row.total,
        change: (row.total - sorted[(index - 1)].total) / sorted[(index - 1)].total * 100
      });
    }
    return acc;
  }, []);

  // calculate the overall totals
  const totals = data.reduce((acc, row) => {
    acc.allTime = acc.allTime + row.total;
    acc.ytd = row.current_year ? acc.ytd + row.total : acc.ytd;
    return acc;
  }, { allTime: 0, ytd: 0 });

  return { data: { totals, monthly }, error: null };
};

module.exports = {
  setDocumentOwner,
  getColleagues,
  deleteColleague,
  createColleague,
  getKPIAccessRequests
};
