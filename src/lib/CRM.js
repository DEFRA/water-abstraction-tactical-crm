/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const { get } = require('lodash');
const uuidv4 = require('uuid/v4');
const DB = require('./connectors/db');
const { pool } = require('./connectors/db');
const { SqlConditionBuilder } = require('./sql');
const DocumentsController = require('../controllers/document-headers')({pool, version: '1.0'});

/**
 * Get documents by the supplied search/filter/sort criteria
 * @param {Object} request - the HAPI request instance
 * @param {Object} request.payload - the data from the HTTP post body
 * @param {Object} [request.payload.filter] - licence filter criteria
 * @param {String} [request.payload.filter.email] - filter licences by owner email address
 * @param {String} [request.payload.filter.entity_id] - filter licence by user entity ID
 * @param {String} [request.payload.filter.string] - search string, searches licences on name/licence number fields
 * @param {String} [request.payload.filter.document_id] - filters on a particular licence document_id
 * @param {String|Array} [request.payload.filter.system_external_id] - filters on 1 or more licence numbers
 * @param {Number} [request.payload.filter.verified] - filters on whether verified 0|1
 * @param {Object} [request.payload.sort] - sort criteria
 * @param {Number} [request.payload.sort.document_id] - sort by document_id +1 : ascending, -1 : descending
 * @param {Number} [request.payload.sort.name] - sort on document name +1 : ascending, -1 : descending
 * @param {Object} [request.payload.pagination] - sets pagination options
 * @param {Number} [request.payload.pagination.page] - sets current page of results
 * @param {Number} [request.payload.pagination.perPage] - sets number of results to access per page
 * @return {Promise} resolves with array of licence data
 */
async function getRoleDocuments (request, h) {
  try {
    console.log(`Post call to document filter is deprecated, please use the GET call instead`);

    const payload = request.payload || {};
    const { filter = {}, sort = {}, pagination = { perPage: 100, page: 1 } } = payload;

    // Synthesise GET call
    const newRequest = {
      method: 'get',
      params: {
      },
      query: {
        filter: JSON.stringify(filter),
        sort: JSON.stringify(sort),
        pagination: JSON.stringify(pagination)
      }
    };

    console.log('ERROR filter', filter);
    console.log(JSON.stringify(newRequest, null, 2));
    const response = await DocumentsController.find(newRequest, h, true);
    return response;
  } catch (error) {
    console.error(error);
    h.response({ error }).code(500);
  }
}

/**
 * A method to bulk-update a group of document header records for verification steps
 *
 * @todo replace with REST API - but will require this to support multi-record patch first
 *
 * @param {Object} request - the HAPI HTTP request
 * @param {Object} request.payload.query - a query specifying which docs to update
 * @param {Array} [request.payload.query.document_id] - an array of document IDs to update
 * @param {String} [request.payload.query.verification_id] - identifies a group of docs to update based on a verification record
 * @param {String} [request.payload.set.verification_id] - sets the verification_id on the queried documents
 * @param {Number} [request.payload.set.verified] - sets whether verified
 * @param {Object} h - the HAPI HTTP response toolkit
 */
function updateDocumentHeaders (request, h) {
  let query = 'UPDATE crm.document_header SET ';
  const builder = new SqlConditionBuilder();

  // Update verification ID
  const set = [];
  if ('verification_id' in request.payload.set) {
    builder.addParam(request.payload.set.verification_id);
    set.push(` verification_id= $${builder.params.length} `);
  }
  if ('verified' in request.payload.set) {
    builder.addParam(request.payload.set.verified);
    set.push(` verified= $${builder.params.length} `);
  }
  if ('company_entity_id' in request.payload.set) {
    builder.addParam(request.payload.set.company_entity_id);
    set.push(` company_entity_id= $${builder.params.length} `);
  }

  // Query on document ID
  query += set.join(',') + ' WHERE 0=0 ';

  if (request.payload.query.document_id) {
    builder.and('document_id', request.payload.query.document_id);
  }
  if (request.payload.query.verification_id) {
    builder.and('verification_id', request.payload.query.verification_id);
  }

  query += builder.getSql();
  const queryParams = builder.getParams();
  console.log(query, queryParams);

  DB.query(query, queryParams)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
}

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

  console.log(query);
  console.log(queryParams);

  return DB.query(query, queryParams)
    .then((res) => {
      return {
        error: res.error,
        document_id: request.params.document_id
      };
    });
}

function getColleagues (request, h) {
  console.log(request.query);
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
      console.error(err);
      return h.response(err);
    });
}

function deleteColleague (request, h) {
  var entityRoleId = request.params.role_id;
  const query = `
    delete from crm.entity_roles where entity_role_id=$1
      `;
  const queryParams = [entityRoleId];

  return DB.query(query, queryParams)
    .then((res) => {
      console.log('woo! delete!');
      return h.response(res.data);
    }).catch((err) => {
      console.log('BOO! delete!', err);
      return h.response(err);
    });
}

function createColleague (request, h) {
  // TODO: make this query less fugly
  const query = `
    insert into crm.entity_roles
    select
      uuid_in(md5(random()::text || now()::text)::cstring),
      e.entity_id,
      'user',
      r.regime_entity_id,
      r.company_entity_id,
      CURRENT_TIMESTAMP,
      $1::text
    from crm.entity_roles r
      join crm.entity e on (e.entity_nm = $2)
    where r.entity_id = $1 on conflict (entity_id, regime_entity_id, company_entity_id)
    DO UPDATE set role='user'`;

  const email = get(request, 'payload.email', '').toLowerCase();
  const params = [request.params.entity_id, email];

  return DB.query(query, params)
    .then(res => h.response(res.data))
    .catch((err) => {
      console.error(err);
      return h.response(err);
    });
}

module.exports = {
  getRoleDocuments,
  updateDocumentHeaders,
  setDocumentOwner,
  getColleagues,
  deleteColleague,
  createColleague
};
