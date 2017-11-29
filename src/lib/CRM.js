const Helpers = require('./helpers')
const DB = require('./connectors/db')

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

function getEntity(request, reply) {
  var responseData = {};
  var query = `select * from crm.entity where lower(entity_id)=lower($1) or lower(entity_nm)=lower($1)`
  var queryParams = [request.params.entity_id]
  console.log(`${query} with ${queryParams}`)
  DB.query(query, queryParams)
    .then((res) => {
      if (res.data[0]) {
        responseData.entity = res.data;
        var entityId = res.data[0].entity_id
      } else {
        responseData.entity = res.data;
        var entityId = 0
      }
      console.log(`getEntity returns ${res.data.length} rows`)
      //get upstream entities
      var query = `
    select a.*, eu.entity_nm entity_up_nm, ed.entity_nm entity_down_nm
from crm.entity_association a
join crm.entity eu on lower(a.entity_up_id) = lower(eu.entity_id)
join crm.entity ed on lower(a.entity_down_id) = lower(ed.entity_id)
where lower(a.entity_up_id)=lower($1)

    union

select a.*, eu.entity_nm entity_up_nm, ed.entity_nm entity_down_nm
from crm.entity_association a
join crm.entity eu on a.entity_up_id = eu.entity_id
join crm.entity ed on a.entity_down_id = ed.entity_id
where lower(a.entity_down_id)=lower($1)
    `
      var queryParams = [entityId]
      DB.query(query, queryParams)
        .then((res) => {
          responseData.entityAssociations = res.data;
          var query = `
          select * from crm.document_header
where document_id in (select document_id from crm.document_association where entity_id=$1)


      `
          var queryParams = [entityId]
          console.log('permissions')
          console.log(query)
          console.log(queryParams)

          DB.query(query, queryParams)
            .then((res) => {
              console.log(`${res.data.length} document headers listed for owner ${entityId}`)
              responseData.documentAssociations = res.data;

              return reply({
                error: res.error,
                data: responseData
              })
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

function getDocumentHeaders(request, reply) {
  var query = `
  SELECT
  	H.*,
  	E.entity_nm,
    E.entity_id,
  	M.value as name
  FROM
  	crm.document_header H
  	LEFT OUTER JOIN crm.document_association A ON H.document_id = A.document_id
  	LEFT OUTER JOIN crm.entity E ON A.entity_id = E.entity_id
  	LEFT OUTER JOIN crm.entity_document_metadata M ON (
  	M.entity_id = E.entity_id
  	)
    where 0=0
  `
  var queryParams = []
  if (request.payload && request.payload.filter) {
    if (request.payload.filter.email) {
      queryParams.push(request.payload.filter.email)
      query += ` and lower(e.entity_nm)=lower($${queryParams.length})`
    }

    if (request.payload.filter.entity_id) {
      queryParams.push(request.payload.filter.entity_id)
      query += ` and e.entity_id=$${queryParams.length}`
    }

    if (request.payload.filter.string) {
      queryParams.push(request.payload.filter.string)
      query += ` and ( h.metadata->>'Name' ilike $${queryParams.length} or M.value ilike $${queryParams.length})`

    }
  }
  console.log(query)
  console.log(queryParams)
  DB.query(query,queryParams)
    .then((res) => {
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
      select value from crm.entity_document_metadata where entity_id=$2 and document_id=$1 and key='name'
    `
  var queryParams = [
    request.params.document_id,
    request.params.entity_id
  ]

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
      insert into crm.entity_document_metadata (document_id,entity_id,key,value)
      values($1,$2,'name',$3)
      ON CONFLICT (document_id,entity_id,key) DO UPDATE
      SET value = $3;
    `
  var queryParams = [
    request.params.document_id,
    request.params.entity_id,
    request.payload.name
  ]


  DB.query(query, queryParams)
    .then((res) => {
      getDocumentNameForUser(request, reply)
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
  setDocumentNameForUser: setDocumentNameForUser
}
