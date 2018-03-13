/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Helpers = require('./helpers')
const DB = require('./connectors/db')
const moment = require('moment');
const {SqlConditionBuilder, SqlSortBuilder} = require('./sql');

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
function _getEntityRecord(entity_identifier) {
  return new Promise((resolve, reject) => {
    console.log('_getEntityRecord')
    var query = `select * from crm.entity where lower(entity_id)=lower($1) or lower(entity_nm)=lower($1)`
    var queryParams = [entity_identifier]
    //      console.log(`${query} with ${queryParams}`)
    DB.query(query, queryParams).then((res) => {
      console.log(res.data[0])
      resolve(res.data[0])
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Get entity roles from CRM
 * @param {string} entity_identifier - the guid of the entity
 * @return {Promise} resolves with entity role data
 */
function _getEntityRoles(entity_identifier) {
  return new Promise((resolve, reject) => {
    console.log('_getEntityRoles')
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
where r.entity_id=$1	 or individual.entity_nm=$1	or r.company_entity_id=$1`
    var queryParams = [entity_identifier]
    console.log(`${query} with ${queryParams}`)
    DB.query(query, queryParams)
      .then((res) => {
        console.log(res)
        resolve(res.data)
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
  })
}

/**
 * Get entity roles from CRM
 * @param {array} rolesArray - an array of role objects
 * @return {Promise} resolves with document available to role
 */
function _getRoleDocuments(rolesArray) {
  return new Promise((resolve, reject) => {
    console.log('_getRoleDocuments')
    var documents = [];
    var query = ''
    queryParams = [];

    for (role in rolesArray) {
      if (query && query.length && query.length > 0) {
        query += ' union all '
      }
      var thisRole = rolesArray[role]
      query += `select '${thisRole.role}' as role, '${thisRole.entity_role_id}' as role_id, h.* from crm.document_header h where 0=0 `
      if (thisRole.regime_entity_id && thisRole.regime_entity_id.length > 0) {
        queryParams.push(thisRole.regime_entity_id)
        query += ' and h.regime_entity_id=$' + queryParams.length
      }
      if (thisRole.company_entity_id && thisRole.company_entity_id.length > 0) {
        queryParams.push(thisRole.company_entity_id)
        query += ' and h.company_entity_id=$' + queryParams.length
      }


    }
    console.log(query)
    console.log(queryParams)


    DB.query(query, queryParams)
      .then((res) => {
        console.log('got role documents')
        console.log(res.data)
        resolve(res.data)
      }).catch((err) => {
        console.log('error getting role documents')
        console.log(err)
        reject(err)
      })

  })
}

/**
 * Get documents by the supplied search/filter/sort criteria
 * @todo rewrite with async/await for readability
 * @param {Object} request - the HAPI request instance
 * @param {Object} request.params - the data from the HTTP query string
 * @param {Object} [request.params.entity_id] - entity id for entity
 * @return {object} Returns object containing entity data
 */
function getEntity(request, reply) {
  var responseData = {};
  var entityId
  _getEntityRecord(request.params.entity_id).then((entity) => {
    responseData.entity = entity;
    var entityId = entity.entity_id
  }).catch((err) => {
    console.log(err)
    responseData.entity = {};
    var entityId = 0
  }).then(() => {
    //get upstream entities deprecated but not yet removed...
    responseData.entityAssociations = []
    //get entity roles
    _getEntityRoles(request.params.entity_id).then((entityRoles) => {
      console.log(`get entity roles for ${request.params.entity_id}`)
      console.log(entityRoles)
      responseData.entityRoles = entityRoles
    }).catch((err) => {
      console.log(err)
      responseData.entityRoles = []
    }).then(() => {

      responseData.roleDocuments = []

      var response = {
        error: null,
        data: responseData
      }
      console.log(response)
      return reply(response)

/**
      _getRoleDocuments(responseData.entityRoles)
        .then((roleDocuments) => {
          console.log(`get entity roleDocuments for ${request.params.entity_id}`)
          console.log(responseData.roleDocuments)
          responseData.roleDocuments = roleDocuments
        }).catch((err) => {
          console.log(err)
          responseData.roleDocuments = []
        }).then(() => {
          var response = {
            error: null,
            data: responseData
          }
          console.log(response)
          return reply(response)
        })
**/
    })
  })
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
async function getRoleDocuments(request, reply) {
  const defaultPagination = {
    page : 1,
    perPage : 100
  };
  const payload = request.payload || {}
  const pagination = payload.pagination || defaultPagination;
  const limit = pagination.perPage, offset = (pagination.page - 1) * pagination.perPage;
  console.log('here 4')
  var response={
    error: null,
    data: null,
    summary: null,
  }
  var query = `
  select count(role),role from crm.role_document_access where individual_entity_id=$1 group by role
  `
  if(request.payload && request.payload.filter){
  var queryParams = [request.payload.filter.entity_id]
  } else {
  var queryParams = []
  }


  var summaryRes= await DB.query(query, queryParams)
  response.summary=summaryRes.data

  const builder = new SqlConditionBuilder();

  query = `select * from (
  select core.*,dh.metadata,dh.verified,
  dh.metadata->>'Name' as document_original_name,
  dh.metadata->>'Expires' as document_expires,
  dh.metadata->>'AddressLine1' as document_address_line_1,
  dh.metadata->>'AddressLine2' as document_address_line_2,
  dh.metadata->>'AddressLine3' as document_address_line_3,
  dh.metadata->>'AddressLine4' as document_address_line_4,
  dh.metadata->>'Town' as document_town,
  dh.metadata->>'County' as document_county,
  dh.metadata->>'Postcode' as document_postcode,
  dh.metadata->>'Country' as document_country,
	hd.value AS document_custom_name
from (
  SELECT
  	distinct
    document_id,system_internal_id, system_external_id,
    company_entity_id,regime_entity_id, system_id, individual_entity_id, individual_nm
    from crm.role_document_access
) core
join crm.document_header dh on dh.document_id= core.document_id
left join crm.entity_document_metadata hd on (hd.key='name' and hd.document_id = core.document_id)
) data
where 0=0
  `
  // var queryParams = []
  if (request.payload && request.payload.filter) {

    // email filter
    if(request.payload.filter.email) {
      builder.andCaseInsensitive('individual_nm', request.payload.filter.email);
    }

    // standard field filters
    ['document_id', 'system_external_id', 'verified', 'verification_id'].forEach((field) => {
      if(field in request.payload.filter) {
        builder.and(field, request.payload.filter[field]);
      }
    });

    queryParams = builder.getParams();
    query += builder.getSql();

    // special filters
    if (request.payload.filter.entity_id) {
      queryParams.push(request.payload.filter.entity_id)
//      query += ` and data.document_id in (select document_id from crm.role_document_access where individual_entity_id=$${queryParams.length}) `;
        query += ` and individual_entity_id=$${queryParams.length}`;
    }

    if (request.payload.filter.string) {
      queryParams.push(`%${request.payload.filter.string}%`);
      query += ` and ( document_custom_name ilike $${queryParams.length} OR system_external_id ilike $${queryParams.length} )`
    }


    // Sorting
    // e.g. {document_id : 1}
    if (request.payload.sort && Object.keys(request.payload.sort).length) {
        const sort = new SqlSortBuilder();
        query += sort.add(request.payload.sort).getSql()
    }
  }

  // Get total row count without pagination
  var rowCountQuery = query.replace(/^select \*/, `SELECT COUNT(*) AS totalrowcount `).replace(/ORDER BY .*/, '');

  query += ` LIMIT ${limit} OFFSET ${offset}`;

  try{
    var res=await DB.query(query, queryParams);
    var res2= await DB.query(rowCountQuery, queryParams);
    console.log(rowCountQuery, queryParams)
//    console.log(res)
//    console.log(res2)
    const totalRows = parseInt(res2.data[0].totalrowcount, 10);

    response.data=res.data
    response.pagination = {
      ...pagination,
      totalRows,
      pageCount : Math.ceil(totalRows / pagination.perPage)
    };
    return reply(response)
  }catch(e){
    console.log(e)
    return reply(e)
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
 * @param {Object} reply - the HAPI HTTP reply
 */
 function updateDocumentHeaders(request, reply) {
   let query = 'UPDATE crm.document_header SET ';
   const builder = new SqlConditionBuilder();

   // Update verification ID
   const set = [];
   if('verification_id' in request.payload.set) {
     builder.addParam(request.payload.set.verification_id);
     set.push(` verification_id= $${ builder.params.length } `);
   }
   if('verified' in request.payload.set) {
     builder.addParam(request.payload.set.verified);
     set.push(` verified= $${ builder.params.length } `);
   }
   if('company_entity_id' in request.payload.set) {
     builder.addParam(request.payload.set.company_entity_id);
     set.push(` company_entity_id= $${ builder.params.length } `);
   }

   // Query on document ID
   query += set.join(',') + ' WHERE 0=0 ';

   if(request.payload.query.document_id) {
     builder.and('document_id', request.payload.query.document_id);
   }
   if(request.payload.query.verification_id) {
     builder.and('verification_id', request.payload.query.verification_id);
   }

   query += builder.getSql();
   queryParams = builder.getParams();

   console.log(query, queryParams);

   DB.query(query, queryParams)
     .then((res) => {
       return reply(res);
     })
     .catch((err) => {
       return reply(err)
     });

 }





function setDocumentOwner(request, reply) {
  console.log(request.payload)
  var guid = Helpers.createGUID();
  var query = `
    update crm.document_header set company_entity_id=$1 where document_id=$2
  `
  var queryParams = [

    request.payload.entity_id,
    request.params.document_id,
    guid
  ]
  console.log(query)
  console.log(queryParams)
  DB.query(query, queryParams)
    .then((res) => {
      var query = `

        insert into crm.document_association(document_association_id,document_id,entity_id) values ($3,$2,$1)
      `

      DB.query(query, queryParams)
        .then((res) => {

          return reply({
            error: res.error,
            document_id: request.params.document_id
          })
        })

    })
}

function getDocumentNameForUser(request, reply) {
  var query = `
      select value from crm.entity_document_metadata where document_id=$1 and key='name'
    `
  var queryParams = [
    request.params.document_id
  ]
  console.log(query)
  console.log(queryParams)
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: res.data
      })
    }).catch((err) => {
      return reply(err)
    })
}

function setDocumentNameForUser(request, reply) {
  //note: uses onconflict for upsert
  var query = `
      insert into crm.entity_document_metadata (entity_id,document_id,key,value)
      values(0,$1,'name',$2)
      ON CONFLICT (entity_id,document_id,key) DO UPDATE
      SET value = $2;
    `

  console.log(request.payload.name)
  var queryParams = [
    request.params.document_id,
    request.payload['name']
  ]

  console.log(query, queryParams)


  DB.query(query, queryParams)
    .then((res) => {
      console.log(res)
      getDocumentNameForUser(request, reply)
    }).catch((err) => {
      console.log(err);
      return reply(err)
    })


}


function getColleagues(request, reply) {

console.log(request.query)
  var entity_id = request.params.entity_id
  /**
  identify user roles who the supplied user can admin
    i.e. users with a different entity id who have role that have the same company
  **/

  query =`  select
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
    `

  queryParams = [
    entity_id
  ]
  if(request.query.direction == 1 ){
    query+=' order by '+request.query.sort+' asc'
  } else {
    query+=' order by '+request.query.sort+' desc'

  }


  DB.query(query, queryParams)
    .then((res) => {
      return reply(res.data)
    }).catch((err) => {
      return reply(err)
    })
}

function deleteColleague(request,reply){

    var entity_role_id = request.params.role_id
    query =`
    delete from crm.entity_roles where entity_role_id=$1
      `
    queryParams = [
      entity_role_id
    ]


    DB.query(query, queryParams)
      .then((res) => {
        console.log('woo! delete!')
        return reply(res.data)
      }).catch((err) => {
        console.log('BOO! delete!',err)
        return reply(err)
      })
}

function createColleague(request,reply){
  //TODO: make this query less fugly
  var entity_id = request.params.entity_id
  var email = request.payload.email
  query =`
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
    `

  console.log(query)

  DB.query(query)
    .then((res) => {
      return reply(res.data)
    }).catch((err) => {
      return reply(err)
    })




}

module.exports = {
  getEntity,
  getRoleDocuments,
  updateDocumentHeaders,
  setDocumentOwner: setDocumentOwner,
  getDocumentNameForUser: getDocumentNameForUser,
  setDocumentNameForUser: setDocumentNameForUser,
  getColleagues: getColleagues,
  deleteColleague:deleteColleague,
  createColleague:createColleague
}
