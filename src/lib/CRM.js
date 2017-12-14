/**
 * Provides HAPI HTTP handlers for working with CRM data
 * @module lib/CRM
 */
const Helpers = require('./helpers')
const DB = require('./connectors/db')
const moment = require('moment');
const {SqlConditionBuilder, SqlSortBuilder} = require('./sql');


/**
 * @TODO update multiple entities
 */


/**
 * Create new verification record
 * A random verification code string is generated as part of this call and returned
 * in the JSON body along with the verification_id
 * The verification_id can be used in other tables so that when the user enters
 * the code, all documentHeader records related to this verification can be updated
 *
 * @param {Object} request - HAPI HTTP request
 * @param {String} request.payload.entity_id - the GUID of the current individual's entity
 * @param {String} request.payload.company_entity_id - the GUID of the current individual's company
 * @param {String} request.payload.method - the verification method - post|phone
 * @param {Object} reply - the HAPI HTTP reply
 */
function createNewVerification(request, reply) {
  const guid = Helpers.createGUID();
  const verification_code = Helpers.createShortCode();

  Helpers.createHash(verification_code)
    .then((hashedCode) => {
      const query = `
        insert into crm.verification(verification_id, entity_id, company_entity_id, verification_code, date_created, method)
        values ($1,$2,$3,$4, NOW(), $5)
      `;
      const queryParams = [guid, request.payload.entity_id, request.payload.company_entity_id, hashedCode, request.payload.method];
      return DB.query(query, queryParams);
    })
    .then((res) => {
      return reply({
        error: res.error,
        data: {
          verification_id: guid,
          verification_code
        }
      })
    });
}

/**
 * Update a verification record with date_verified timestamp
 * Can only be done once - i.e. date_verified must be null
 * @param {Object} request - HAPI HTTP request
 * @param {String} request.params.verification_id - the GUID of the verification record
 * @param {String} request.payload.date_verified - timestamp for when verification took place
 * @param {Object} reply - the HAPI HTTP reply
 */
function updateVerification(request, reply) {
  const query = `UPDATE crm.verification
    SET date_verified=$1
    WHERE verification_id=$2`;
  const queryParams = [moment(request.payload.date_verified).format('YYYY-MM-DD HH:mm:ss'), request.params.verification_id];
  DB.query(query, queryParams)
    .then((res) => {
      console.log(res);
      return reply(res);
    });
}


/**
 * Checks a verification code
 * @param {Object} request - HAPI HTTP request
 * @param {Object} request.payload
 * @param {String} request.payload.entity_id - the individual's entity_id
 * @param {String} request.payload.company_entity_id - the company entity_id
 * @param {Object} reply - the HAPI HTTP reply
 */
function checkVerificationCode(request,reply) {
  const query = `SELECT *
    FROM crm.verification
    WHERE entity_id=$1
      AND company_entity_id=$2
    LIMIT 1`;
  const queryParams = [request.payload.entity_id, request.payload.company_entity_id];
  DB.query(query, queryParams)
    .then((res) => {

      // Stop now if DB error
      if(res.error) {
        return reply(res);
      }
      // Record found
      else if(res.data && res.data.length==1) {
        // Check supplied code
        return Helpers.compareHash(request.payload.verification_code, res.data[0].verification_code);
      }
      else {
        return reply({error : 'Verification record not found', data : []});
      }

    })
    .then((code) => {
      if(code === 200) {
        return reply({error : null, data : []}).code(200);
      }
      else {
        return reply({error : 'Verification failed', data : []}).code(code);
      }
    })
    .catch((err) => {
      console.error(err);
      return reply({error : err, data : []});
    });
}

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
where r.entity_id=$1	 or individual.entity_nm=$1	`
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
          var response = {
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

/**
 * Delete an entity with the specified GUID
 * @param {Object} request - the HAPI HTTP request
 * @param {String} request.params.entity_id - the entity GUID
 * @param {Object} reply - HAPI HTTP response
 */
function deleteEntity(request, reply) {
  const query = `DELETE FROM crm.entity WHERE entity_id=$1`;
  const queryParams = [request.params.entity_id];
  DB.query(query, queryParams)
    .then((res) => {
      return reply({
        error: res.error,
        data: {}
      })
    })
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
 * @param {String} [request.payload.filter.email] - filter licences by owner email address
 * @param {String} [request.payload.filter.entity_id] - filter licence by user entity ID
 * @param {String} [request.payload.filter.string] - search string, searches licences on name/licence number fields
 * @param {String} [request.payload.filter.document_id] - filters on a particular licence document_id
 * @param {String|Array} [request.payload.filter.system_external_id] - filters on 1 or more licence numbers
 * @param {Number} [request.payload.filter.verified] - filters on whether verified 0|1
 * @param {Object} [request.payload.sort] - sort criteria
 * @param {Number} [request.payload.sort.document_id] - sort by document_id +1 : ascending, -1 : descending
 * @param {Number} [request.payload.sort.name] - sort on document name +1 : ascending, -1 : descending
 * @return {Promise} resolves with array of licence data
 */
function getDocumentHeaders(request, reply) {


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
  var queryParams = [0]
  }
  DB.query(query, queryParams)
    .then((res) => {
      response.summary=res.data

      const builder = new SqlConditionBuilder();

  let queryParams;
  let query = `
  SELECT
  	distinct
    document_id,system_internal_id, system_external_id,
    metadata->>'Name' as document_original_name,
    metadata->>'AddressLine1' as document_address_line_1,
    metadata->>'AddressLine2' as document_address_line_2,
    metadata->>'AddressLine3' as document_address_line_3,
    metadata->>'AddressLine4' as document_address_line_4,
    metadata->>'Town' as document_town,
    metadata->>'County' as document_county,
    metadata->>'Postcode' as document_postcode,
    metadata->>'Country' as document_country,
    document_custom_name,
    company_entity_id,regime_entity_id, system_id
    from crm.role_document_access where 0=0
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
      query += ` and document_id in (select document_id from crm.role_document_access where individual_entity_id=$${queryParams.length}) `;
    }

    if (request.payload.filter.string) {
      queryParams.push(`%${request.payload.filter.string}%`);
      query += ` and ( metadata->>'Name' ilike $${queryParams.length} or document_custom_name ilike $${queryParams.length} OR system_external_id ilike $${queryParams.length} )`
    }


    // Sorting
    // e.g. {document_id : 1}
    if (request.payload.sort && Object.keys(request.payload.sort).length) {
        const sort = new SqlSortBuilder();
        query += sort.add(request.payload.sort).getSql()
    }
  }

  console.log(query, queryParams);

  DB.query(query, queryParams)
    .then((res) => {
      response.data=res.data
      return reply(response)
    })
  }).catch((err)=>{
    console.log(err)
    response.error=err;
    return reply(response)

  })
}

function createDocumentHeader(request, reply) {
  var guid = Helpers.createGUID();
  var query = `
    insert into crm.document_header(
      document_id,
      regime_entity_id,
      system_id,
      system_internal_id,
      system_external_id,
      metadata
    )
      values ($1,$2,$3,$4,$5,$6)
      on conflict (system_id,system_internal_id,regime_entity_id) do update set
      document_id=EXCLUDED.document_id,
      system_external_id=EXCLUDED.system_external_id,
      metadata=EXCLUDED.metadata

  `
  var queryParams = [
    guid,
    request.payload.regime_entity_id,
    request.payload.system_id,
    request.payload.system_internal_id,
    request.payload.system_external_id,
    request.payload.metadata
  ]

  console.log(query)
  console.log(queryParams)

  DB.query(query, queryParams)
    .then((res) => {




          return reply({
            error: res.error,
            data: {
              document_id: guid
            }
          })


    }).catch((err) => {
      console.log(err)

    })
}

function deleteDocumentHeader(request, reply) {
  console.log('Not implemented');
  return reply({}).code(501);
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
        company_entity_id=$4,
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
      request.payload.company_entity_id,
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
        company_entity_id=$3,
        system_id=$4,
        system_internal_id=$5,
        system_external_id=$6,
        metadata=$7
      where document_id=$1
    `
    var queryParams = [
      request.params.document_id,
      request.payload.regime_entity_id,
      request.payload.company_entity_id,
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



/**
 * A method to bulk-update a group of document header records for verification steps
 * @param {Object} request - the HAPI HTTP request
 * @param {Object} request.payload.query - a query specifying which docs to update
 * @param {Array} [request.payload.query.document_id] - an array of document IDs to update
 * @param {String} [request.payload.query.verification_id] - identifies a group of docs to update based on a verification record
 * @param {String} [request.payload.set.verification_id] - sets the verification_id on the queried documents
 * @param {Number} [request.payload.set.verified] - sets whether verified
 * @param {Object} reply - the HAPI HTTP reply
 */
 function updateDocumentHeaders(request, reply) {
   let query = 'UPDATE crm.document_header';
   const queryParams = [];

   // Update verification ID
   if(request.payload.set.verification_id) {
     queryParams.push(request.payload.set.verification_id);
     query += ` SET verification_id= $${ queryParams.length } `;
   }
   else if(request.payload.set.verified) {
     queryParams.push(request.payload.set.verified);
     query += ` SET verified= $${ queryParams.length } `;
   }

   // Query on document ID
   query += ' WHERE ';
   if(request.payload.query.document_id) {
     queryParams.push(request.payload.query.document_id.join(','));
     query += ` document_id IN ($${ queryParams.length }) `;
   }
   // Update on verification ID
   else if(request.payload.query.verification_id) {
     queryParams.push(request.payload.query.verification_id);
     query += ` verification_id=$${ queryParams.length } `;
   }

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

function getColleagues(request, reply) {

  var entity_id = request.params.entity_id
  /**
  identify user roles who the supplied user can admin
    i.e. users with a different entity id who have role that have the same company
  **/

  query =`
    select
    distinct
    grantee_role.entity_role_id,
    grantee_role.individual_entity_id,
    grantee_role.individual_nm,
    grantee_role.role,
    grantee_role.regime_entity_id,
    grantee_role.company_entity_id,
    grantee_role.created_at,
    grantee_role.created_by
    from crm.entity_roles granter_role
    left outer join crm.role_document_access grantee_role on (
    (
    	granter_role.regime_entity_id = grantee_role.regime_entity_id and
    	granter_role.company_entity_id is null
    )
    or
    (
    	granter_role.company_entity_id = grantee_role.company_entity_id
    )
    )
    where
    granter_role.entity_id=$1
    and ( granter_role.role='admin' or granter_role.is_primary=1 )
    and grantee_role.individual_entity_id !=$1
    `

  queryParams = [
    entity_id
  ]

  console.log(query, queryParams)

  DB.query(query, queryParams)
    .then((res) => {
      return reply(res.data)
    }).catch((err) => {
      return reply(err)
    })


}

function deleteColleague(request,reply){
  //TODO: remove colleage using entity & role id
}

function createColleague(request,reply){
  //TODO: invite colleage using email -> (notify && create account / existing account)
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
  updateDocumentHeaders,
  deleteDocumentHeader: deleteDocumentHeader,
  setDocumentOwner: setDocumentOwner,
  getDocumentNameForUser: getDocumentNameForUser,
  setDocumentNameForUser: setDocumentNameForUser,
  addEntityRole: addEntityRole,
  deleteEntityRole: deleteEntityRole,
  getEntityRoles: getEntityRoles,
  getColleagues: getColleagues,
  deleteColleague:deleteColleague,
  createColleague:createColleague,
  createNewVerification,
  updateVerification,
  checkVerificationCode

}
