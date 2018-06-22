/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Helpers = require('./helpers');
const DB = require('./connectors/db');
const { pool } = require('./connectors/db');
const { SqlConditionBuilder } = require('./sql');
const DocumentsController = require('../controllers/document-headers')({pool, version: '1.0'});
/**
 * @TODO REST API updates:
 * - permit repo entity filtering on company/individual was query string
 * Missing routes in new API
 * - GET /documentHeader/{system_id}/{system_internal_id}
 * - PUT /documentHeader/{system_id}/{system_internal_id}
 * - DELETE /documentHeader/{system_id}/{system_internal_id}
 * create document_header now missing on conflict update
 */

/**
 * Get entity record from CRM
 * @param {string} entity_identifier - the guid or entity_nm of the entity
 * @return {Promise} resolves with entity data
 */
function _getEntityRecord (entityIdentifier) {
  return new Promise((resolve, reject) => {
    console.log('_getEntityRecord');
    const query = `select * from crm.entity where lower(entity_id)=lower($1) or lower(entity_nm)=lower($1)`;
    const queryParams = [entityIdentifier];
    //      console.log(`${query} with ${queryParams}`)
    DB.query(query, queryParams).then((res) => {
      console.log(res.data[0]);
      resolve(res.data[0]);
    }).catch((err) => {
      reject(err);
    });
  });
}

/**
 * Get entity roles from CRM
 * @param {string} entity_identifier - the guid of the entity
 * @return {Promise} resolves with entity role data
 */
function _getEntityRoles (entityIdentifier) {
  return new Promise((resolve, reject) => {
    console.log('_getEntityRoles');
    var query = `select distinct
    r.entity_role_id,
    r.role,
    r.entity_id ,
    r.company_entity_id,
    r.regime_entity_id,
    individual.entity_nm as individual_name,
    company.entity_nm as company_name,
    regime.entity_nm as regime_name
    from
    crm.entity_roles r
    join crm.entity individual on r.entity_id=individual.entity_id
    left join crm.entity company on r.company_entity_id=company.entity_id
    left join crm.entity regime on r.regime_entity_id=regime.entity_id
    where r.entity_id=$1 or individual.entity_nm=$1 or r.company_entity_id=$1`;
    var queryParams = [entityIdentifier];
    console.log(`${query} with ${queryParams}`);
    DB.query(query, queryParams)
      .then((res) => {
        console.log(res);
        resolve(res.data);
      }).catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

/**
 * Get documents by the supplied search/filter/sort criteria
 * @todo rewrite with async/await for readability
 * @param {Object} request - the HAPI request instance
 * @param {Object} request.params - the data from the HTTP query string
 * @param {Object} [request.params.entity_id] - entity id for entity
 * @return {object} Returns object containing entity data
 */
function getEntity (request, h) {
  const responseData = {
    entity: {},
    entityRoles: [],
    entityAssociations: [],
    roleDocuments: []
  };

  const entityId = request.params.entity_id;

  return _getEntityRecord(entityId)
    .catch(err => console.log(err))
    .then(entity => {
      // get upstream entities deprecated but not yet removed...
      responseData.entity = entity;

      // get entity roles
      console.log(`get entity roles for ${entityId}`);
      return _getEntityRoles(entityId);
    })
    .catch(err => console.log(err))
    .then((entityRoles) => {
      console.log(entityRoles);
      responseData.entityRoles = entityRoles;
    }).then(() => {
      const response = { error: null, data: responseData };
      console.log(response);
      return response;
    });
}

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
  console.log(request.payload);
  var guid = Helpers.createGUID();
  var query = `
    update crm.document_header set company_entity_id=$1 where document_id=$2
  `;
  var queryParams = [
    request.payload.entity_id,
    request.params.document_id,
    guid
  ];
  console.log(query);
  console.log(queryParams);
  DB.query(query, queryParams)
    .then((res) => {
      var query = `

        insert into crm.document_association(document_association_id,document_id,entity_id) values ($3,$2,$1)
      `;

      DB.query(query, queryParams)
        .then((res) => {
          return {
            error: res.error,
            document_id: request.params.document_id
          };
        });
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

  DB.query(query, queryParams)
    .then((res) => {
      return h.response(res.data);
    }).catch((err) => {
      return h.response(err);
    });
}

function deleteColleague (request, h) {
  var entityRoleId = request.params.role_id;
  const query = `
    delete from crm.entity_roles where entity_role_id=$1
      `;
  const queryParams = [entityRoleId];

  DB.query(query, queryParams)
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
  const email = request.payload.email;
  const query = `
  insert into crm.entity_roles
    select
    uuid_in(md5(random()::text || now()::text)::cstring),
    e.entity_id,
    'user',
    r.regime_entity_id,
    r.company_entity_id,
    0,
    CURRENT_TIMESTAMP,
    '${request.params.entity_id}'
     from crm.entity_roles r
     join crm.entity e on (e.entity_nm = '${email}')

     where r.entity_id='${request.params.entity_id}' on conflict (entity_id,regime_entity_id,company_entity_id)
     DO UPDATE set role='user'
    `;

  console.log(query);

  DB.query(query)
    .then((res) => {
      return h.response(res.data);
    }).catch((err) => {
      return h.response(err);
    });
}

module.exports = {
  getEntity,
  getRoleDocuments,
  updateDocumentHeaders,
  setDocumentOwner: setDocumentOwner,
  // getDocumentNameForUser: getDocumentNameForUser,
  // setDocumentNameForUser: setDocumentNameForUser,
  getColleagues: getColleagues,
  deleteColleague: deleteColleague,
  createColleague: createColleague
};
