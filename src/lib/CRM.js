/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Helpers = require('./helpers')
const DB = require('./connectors/db')
const map = require('lodash/map');

function getAllEntities(request, reply) {
  if (request.query.entity_type) {
    var query = `
      select * from crm.entity where entity_type='${request.query.entity_type}'
    `
  } else {
    var query = `
      select * from crm.entity
    `
  }
  DB.query(query)
    .then((res) => {
      return reply({
        error: res.error,
        data: res.data
      })
    })
}

function createNewEntity(request, reply) {
  var guid = Helpers.createGUID();
  var query = `
    insert into crm.entity(entity_id,entity_nm,entity_type,entity_definition) values ($1,$2,$3,$4)
  `
  var queryParams = [guid, request.payload.entity_nm, request.payload.entity_type, request.payload.entity_definition]
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {
          entity_id: guid
        }
      })
    })
}

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
    entity_role_id,role, individual_entity_id,company_entity_id,regime_entity_id from crm.role_document_access
      where individual_entity_id=$1 or individual_nm=$1`
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

      _getRoleDocuments(responseData.entityRoles)
        .then((roleDocuments) => {
          console.log(`get entity roleDocuments for ${request.params.entity_id}`)
          console.log(responseData.roleDocuments)
          responseData.roleDocuments = roleDocuments
        }).catch((err) => {
          console.log(err)
          responseData.roleDocuments = []
        }).then(() => {
          var response={
            error: null,
            data: responseData
          }
          console.log(response)
          return reply(response)
        })
    })
  })
}

function updateEntity(request, reply) {
  var query = `
    update crm.entity set
    entity_nm=$2,
    entity_type=$3,
    entity_definition=$4
  where entity_id=$1
  `
  var queryParams = [request.params.entity_id, request.payload.entity_nm, request.payload.entity_type, request.payload.entity_definition]
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {}
      })
    })
}

function deleteEntity(request, reply) {
  return reply({}).code(501)
}

function getEntityAssociations(request, reply) {
  var query = `
    select * from crm.entity_association
  `
  DB.query(query)
    .then((res) => {
      return reply({
        error: res.error,
        data: res.data
      })
    })
}

function createEntityAssociation(request, reply) {
  var guid = Helpers.createGUID();
  var query = `
    insert into crm.entity_association(entity_association_id,entity_up_type,entity_up_id,entity_down_type,entity_down_id,access_type,inheritable)
      values ($1,$2,$3,$4,$5,$6,$7)
  `
  var queryParams = [
    guid,
    request.payload.entity_up_type,
    request.payload.entity_up_id,
    request.payload.entity_down_type,
    request.payload.entity_down_id,
    request.payload.access_type,
    request.payload.inheritable
  ]
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {
          entity_association_id: guid
        }
      })
    })
}

function getEntityAssociation(request, reply) {
  var query = `
    select * from crm.entity_association where entity_association_id = $1
  `
  var queryParams = [request.params.entity_association_id]
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: res.data
      })
    })
}

function updateEntityAssociation(request, reply) {
  var query = `
    update crm.entity_association
    set
    entity_up_type=$2,
    entity_up_id=$3,
    entity_down_type=$4,
    entity_down_id=$5,
    access_type=$6,
    inheritable=$7
    where entity_association_id=$1
  `
  var queryParams = [
    request.params.entity_association_id,
    request.payload.entity_up_type,
    request.payload.entity_up_id,
    request.payload.entity_down_type,
    request.payload.entity_down_id,
    request.payload.access_type,
    request.payload.inheritable
  ]
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {}
      })
    })
}

function deleteEntityAssociation(request, reply) {
  return reply({}).code(501)
}


/**
 * Get documents by the supplied search/filter/sort criteria
 * @param {Object} request - the HAPI request instance
 * @param {Object} request.payload - the data from the HTTP post body
 * @param {Object} [request.payload.filter] - licence filter criteria
 * @param {String} [request.payload.email] - filter licences by owner email address
 * @param {String} [request.payload.entity_id] - filter licence by user entity ID
 * @param {String} [request.payload.string] - search string, searches licences on name/licence number fields
 * @param {String} [request.payload.document_id] - filters on a particular licence document_id
 * @param {Object} [request.payload.sort] - sort criteria
 * @param {Number} [request.payload.sort.document_id] - sort by document_id +1 : ascending, -1 : descending
 * @param {Number} [request.payload.sort.name] - sort on document name +1 : ascending, -1 : descending
 * @return {Promise} resolves with array of licence data
 */
function getDocumentHeaders(request, reply) {
  console.log("get docuyment headers")

  console.log(request.payload);

  var query = `
  SELECT
  	* from crm.role_document_access where 0=0
  `
  var queryParams = []
  if (request.payload && request.payload.filter) {
    if (request.payload.filter.email) {
      queryParams.push(request.payload.filter.email)
      query += ` and lower(individual_name)=lower($${queryParams.length})`
    }

    if (request.payload.filter.entity_id) {
      queryParams.push(request.payload.filter.entity_id)
      query += ` and individual_entity_id=$${queryParams.length}`
    }

    if (request.payload.filter.string) {
      queryParams.push(`%${request.payload.filter.string}%`);
      query += ` and ( metadata->>'Name' ilike $${queryParams.length} or document_custom_name ilike $${queryParams.length} OR H.system_external_id ilike $${queryParams.length} )`
    }

    if (request.payload.filter.document_id) {
      queryParams.push(request.payload.filter.document_id);
      query += ` and document_id=$${queryParams.length} `;
    }


    // Sorting
    // e.g. {document_id : 1}
    if (request.payload.sort && Object.keys(request.payload.sort).length) {
      const sortFields = {
        document_id : 'document_id',
        name : ` metadata->>'Name' `
      };

      const sort = map(request.payload.sort, (isAscending, sortField) => {
        if(!(sortField in sortFields)) {
          throw new Error(`Unsupported search field ${ sortField }`);
        }
        return `${ sortFields[sortField] } ${isAscending===-1 ? 'DESC' : 'ASC'}`;
      });
      query += ` ORDER BY ${ sort.join(',')}`;
    }
  }







  console.log(query)
  console.log(queryParams)
  DB.query(query, queryParams)
    .then((res) => {
      console.log(res.error)
      console.log(res.data)
      return reply({
        error: res.error,
        data: res.data
      })
    })
}

function createDocumentHeader(request, reply) {
  var guid = Helpers.createGUID();
  var query = `
    insert into crm.document_header(
      document_id,
      regime_entity_id,
      owner_entity_id,
      system_id,
      system_internal_id,
      system_external_id,
      metadata
    )
      values ($1,$2,$3,$4,$5,$6,$7)
  `
  var queryParams = [
    guid,
    request.payload.regime_entity_id,
    request.payload.owner_entity_id,
    request.payload.system_id,
    request.payload.system_internal_id,
    request.payload.system_external_id,
    request.payload.metadata
  ]
  DB.query(query, queryParams)
    .then((res) => {



      var query = `
        insert into crm.document_association(
          document_association_id,
          document_id,
          entity_id
        )
          values ($1,$2,$3)
      `
      var queryParams = [
        Helpers.createGUID(),
        guid,
        request.payload.owner_entity_id
      ]
      DB.query(query, queryParams)
        .then((res) => {
          return reply({
            error: res.error,
            data: {
              document_id: guid
            }
          })
        })


    })
}

function getDocumentHeader(request, reply) {
  if (request.params.system_id) {
    var query = `
      select * from crm.document_header where system_id = $1 and system_internal_id =$2
    `
    var queryParams = [request.params.system_id, request.params.system_internal_id]
  } else {
    var query = `
      select * from crm.document_header where document_id = $1
    `
    var queryParams = [request.params.document_id]
  }


  DB.query(query, queryParams)
    .then((res) => {
      var returnData = res.data;
      var query = `
        select crm.document_association.*, crm.entity.entity_nm from crm.document_association
        join crm.entity on crm.entity.entity_id=crm.document_association.entity_id
        where document_id = $1
      `
      console.log(query)
      console.log(queryParams)
      var queryParams = [request.params.document_id]

      DB.query(query, queryParams)
        .then((res) => {

          //now get access
          returnData[0].access = res.data
          console.log(returnData)
          return reply({
            error: res.error,
            data: returnData
          })
        })
    })
}

function updateDocumentHeader(request, reply) {
  if (request.params.system_id) {
    var query = `
      update crm.document_header
      set
        regime_entity_id=$3,
        owner_entity_id=$4,
        system_id=$5,
        system_internal_id=$6,
        system_external_id=$7,
        metadata=$8
      where system_id = $1 and system_internal_id =$2
    `
    var queryParams = [
      request.params.system_id,
      request.params.system_internal_id,
      request.payload.regime_entity_id,
      request.payload.owner_entity_id,
      request.payload.system_id,
      request.payload.system_internal_id,
      request.payload.system_external_id,
      request.payload.metadata
    ]
  } else {
    var query = `
      update crm.document_header
      set
        regime_entity_id=$2,
        owner_entity_id=$3,
        system_id=$4,
        system_internal_id=$5,
        system_external_id=$6,
        metadata=$7
      where document_id=$1
    `
    var queryParams = [
      request.params.document_id,
      request.payload.regime_entity_id,
      request.payload.owner_entity_id,
      request.payload.system_id,
      request.payload.system_internal_id,
      request.payload.system_external_id,
      request.payload.metadata
    ]
  }


  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {}
      })
    })
}

function deleteDocumentHeader(request, reply) {
  return reply({})
}


function setDocumentOwner(request, reply) {
  console.log(request.payload)
  var guid = Helpers.createGUID();
  var query = `
    update crm.document_header set owner_entity_id=$1 where document_id=$2
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

  console.log(query,queryParams)


  DB.query(query, queryParams)
    .then((res) => {
      console.log(res)
      getDocumentNameForUser(request, reply)
    }).catch((err) => {
      console.log(err);
      return reply(err)
    })


}

function addEntityRole(request, reply) {
  //Add role to entity
  var entity_role_id = Helpers.createGUID()
  var entity_id = request.params.entity_id
  var role = request.payload.role
  if (request.payload.regime) {
    var regime_entity_id = request.payload.regime
  } else {
    var regime_entity_id = null
  }
  if (request.payload.company) {
    var company_entity_id = request.payload.company
  } else {
    var company_entity_id = null
  }
  if (request.payload.is_primary) {
    var is_primary = 1
  } else {
    var is_primary = 0
  }
  query = `insert into crm.entity_roles (entity_role_id, entity_id,role,regime_entity_id,company_entity_id,is_primary)
  values($1,$2,$3,$4,$5,$6)`

  queryParams = [
    entity_role_id, entity_id, role, regime_entity_id, company_entity_id, is_primary
  ]

  DB.query(query, queryParams)
    .then((res) => {
      return reply(res)
    }).catch((err) => {
      return reply(err)
    })

}

function deleteEntityRole(request, reply) {
  var entity_role_id = request.params.role_id
  query = `delete from crm.entity_roles where entity_role_id = $1`

  queryParams = [
    entity_role_id
  ]

  DB.query(query, queryParams)
    .then((res) => {
      return reply(res)
    }).catch((err) => {
      return reply(err)
    })

}

function getEntityRoles(request, reply) {
  var entity_id = request.params.entity_id
  query = `select * from crm.entity_roles where entity_id = $1`

  queryParams = [
    entity_id
  ]

  DB.query(query, queryParams)
    .then((res) => {
      return reply(res)
    }).catch((err) => {
      return reply(err)
    })
}

module.exports = {
  getAllEntities: getAllEntities,
  createNewEntity: createNewEntity,
  getEntity: getEntity,
  updateEntity: updateEntity,
  deleteEntity: deleteEntity,
  getEntityAssociations: getEntityAssociations,
  createEntityAssociation: createEntityAssociation,
  getEntityAssociation: getEntityAssociation,
  updateEntityAssociation: updateEntityAssociation,
  deleteEntityAssociation: deleteEntityAssociation,
  getDocumentHeaders: getDocumentHeaders,
  createDocumentHeader: createDocumentHeader,
  getDocumentHeader: getDocumentHeader,
  updateDocumentHeader: updateDocumentHeader,
  deleteDocumentHeader: deleteDocumentHeader,
  setDocumentOwner: setDocumentOwner,
  getDocumentNameForUser: getDocumentNameForUser,
  setDocumentNameForUser: setDocumentNameForUser,
  addEntityRole: addEntityRole,
  deleteEntityRole: deleteEntityRole,
  getEntityRoles: getEntityRoles

}
