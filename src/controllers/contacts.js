const { pool } = require('../lib/connectors/db');
const { uniqBy, findIndex } = require('lodash');
const mongoSql = require('mongo-sql');
const sha1 = require('sha1');


/**
 * De-duplicate entities, placing all documents with a de-duped entity
 * @param {Array} entities
 * @return {Array} de-duplicated contact list with all documents attached to each contact
 */
function dedupe(entities) {
  return entities.reduce((acc, entity) => {
    const index = findIndex(acc, { entity_id: entity.entity_id });
    if (index === -1) {
      acc.push(entity);
    } else {
      acc[index].documents.push(...entity.documents);
    }
    return acc;
  }, []);
}


/**
 * Maps data returned from a single row of SQL query to approximate
 * response from an entity contacts table which will presumably follow later
 * @param {Object} row
 * @return {Object} row - mapped to new format
 */
function mapRowsToEntities(rows) {

  return rows.reduce((acc, row) => {
    // Always add licence holder
    const { Salutation, Forename, Name, AddressLine1, AddressLine2 } = row.metadata;
    const { AddressLine3, AddressLine4, Town, County, Postcode, Country } = row.metadata;

    // Generate fake entity_id
    const entity_id = sha1(JSON.stringify({ Salutation, Forename, Name, AddressLine1, AddressLine2, AddressLine3, AddressLine4, Town, County, Postcode, Country }));

    acc.push({
      entity_id,
      email: null,
      role: 'licence_holder',
      salutation: Salutation,
      forename: Forename,
      name: Name,
      address_1: AddressLine1,
      address_2: AddressLine2,
      address_3: AddressLine3,
      address_4: AddressLine4,
      town: Town,
      county: County,
      postcode: Postcode,
      country: Country,
      documents: [{
        document_id: row.document_id,
        system_external_id: row.system_external_id,
        document_name: row.document_name
      }]
    });

    // Add real entity
    if (row.entity_id) {
      acc.push({
        entity_id: row.entity_id,
        email: row.entity_nm,
        role: row.role,
        salutation: null,
        forename: null,
        name: null,
        address_1: null,
        address_2: null,
        address_3: null,
        address_4: null,
        town: null,
        county: null,
        postcode: null,
        country: null,
        documents: [{
          document_id: row.document_id,
          system_external_id: row.system_external_id,
          document_name: row.document_name
        }]
      });
    }

    return acc;

  }, []);



  // const data = {
  //   entity_id: row.entity_id,
  //   email: row.entity_nm,
  //   role: row.role || 'licence_holder',
  //   salutation: Salutation,
  //   forename: Forename,
  //   name: Name,
  //   address_1: AddressLine1,
  //   address_2: AddressLine2,
  //   address_3: AddressLine3,
  //   address_4: AddressLine4,
  //   town: Town,
  //   county: County,
  //   postcode: Postcode,
  //   country: Country,
  //   documents: [{
  //     document_id: row.document_id,
  //     system_external_id: row.system_external_id,
  //     document_name: row.document_name
  //   }]
  // };
  //
  // // Generate a fake entity ID based on unique contact data
  // if (!data.entity_id) {
  //   const { documents, entity_id, ...rest } = data;
  //   data.entity_id = sha1(JSON.stringify({ ...rest }));
  // }


  return data;

}



/**
 * Get contacts route handler
 * Gets a list of documents
 */
async function getContacts(request, reply) {

  let params = [];

  try {

    const filter = JSON.parse(request.query.filter || '{}');

    const query = {
      type: 'select',
      table: "crm.document_header",
      columns: [
        '*',
        'crm.entity.entity_id',
        'crm.entity.entity_nm',
        'crm.entity_roles.role'
      ],
      where: filter,
      joins: [
        // Join on the junction table to get all users books ids
        {
          type: 'left',
          target: 'crm.entity_roles',
          on: {
            company_entity_id: '$crm.document_header.company_entity_id$',
            role: {
              $in: ['primary_user', 'user']
            }
          }
        },
        {
          type: 'left',
          target: 'crm.entity',
          on: { entity_id: '$crm.entity_roles.entity_id$' }
        }
      ]
    };

    const result = mongoSql.sql(query);

    const { rows, error } = await pool.query(result.toString(), result.values);

    reply({
      error,
      data: dedupe(mapRowsToEntities(rows))
    });
  } catch (error) {
    console.log(error);
    reply({ error, data: null }).statusCode(500);
  }
}


module.exports = {
  getContacts
};