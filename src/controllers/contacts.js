const { pool, query } = require('../lib/connectors/db');
const mongoSql = require('mongo-sql');
const logger = require('../lib/logger');

/**
 * Get licence holder postal address contact from row
 * @param {Object} row
 * @return {Object} contact
 */
function getLicenceHolderContact (row) {
  const { Salutation, Forename, Name } = row.metadata;

  const person = { salutation: Salutation, forename: Forename, name: Name };
  const address = getAddress(row);

  return {
    entity_id: null,
    email: null,
    role: 'licence_holder',
    source: 'nald',
    ...person,
    ...address
  };
}

/**
 * Get object of address details from data row
 * @param {Object} row
 * @return {Object} formatted address
 */
function getAddress (row) {
  const { AddressLine1, AddressLine2 } = row.metadata;
  const { AddressLine3, AddressLine4, Town, County, Postcode, Country } = row.metadata;
  return {
    address_1: AddressLine1,
    address_2: AddressLine2,
    address_3: AddressLine3,
    address_4: AddressLine4,
    town: Town,
    county: County,
    postcode: Postcode,
    country: Country
  };
}

/**
 * Get object of blank address details
 * @return {Object} formatted address
 */
function getBlankAddress () {
  return {
    address_1: null,
    address_2: null,
    address_3: null,
    address_4: null,
    town: null,
    county: null,
    postcode: null,
    country: null
  };
}

/**
 * Get entity contact from row
 * @param {Object} row
 * @return {Object} contact
 */
function getEntityContact (row) {
  const address = row.role === 'primary_user' ? getAddress(row) : getBlankAddress();

  return {
    entity_id: row.entity_id,
    email: row.entity_nm,
    role: row.role,
    source: row.source,
    salutation: null,
    forename: null,
    name: null,
    ...address
  };
}

/**
 * Get entity contact from row
 * @param {Object} row
 * @return {Object} contact
 */
function getCompanyContact (row) {
  const address = getBlankAddress();

  return {
    entity_id: row.entity_id,
    email: null,
    role: 'company',
    source: row.source,
    salutation: null,
    forename: null,
    name: row.entity_nm,
    ...address
  };
}

/**
 * Get either individual/company entity
 * @param {Object} row
 * @return {Object} contact
 */
function getContact (row) {
  if (row.entity_id === row.company_entity_id) {
    return getCompanyContact(row);
  }
  return getEntityContact(row);
}

/**
 * Gets the contacts from the supplied licence row.
 * If metadata.contacts is present, then all these are transformed into an array.
 * If absent, then the licence holder contact in the metadata is used as a fallback
 * @param {Object} row - CRM docment header  row
 * @return {Array} - array of licence contacts
 */
function getNaldContacts (row) {
  const { metadata: { contacts } } = row;

  // New field in metadata
  if (contacts) {
    return contacts.map(contact => {
      const { addressLine1, addressLine2, addressLine3, addressLine4, role, initials, type, ...rest } = contact;
      return {
        entity_id: null,
        source: 'nald',
        email: null,
        role: role.toLowerCase().replace(/ /g, '_'),
        address_1: addressLine1,
        address_2: addressLine2,
        address_3: addressLine3,
        address_4: addressLine4,
        initials,
        ...rest
      };
    });
  } else {
    return [getLicenceHolderContact(row)];
  }
}

/**
 * Maps data returned from a single row of SQL query to approximate
 * response from an entity contacts table which will presumably follow later
 * @param {Object} row
 * @return {Object} row - mapped to new format
 */
function mapRowsToEntities (rows) {
  const licences = rows.reduce((acc, row) => {
    const {
      document_id, system_external_id, system_internal_id,
      document_name, entity_id: entityId, company_entity_id } = row;

    // Add licence holder to list
    if (!Object.keys(acc).includes(system_external_id)) {
      acc[system_external_id] = {
        document_id,
        system_external_id,
        system_internal_id,
        document_name,
        company_entity_id,
        contacts: getNaldContacts(row)
      };
    }

    // Add entity email address contact to list
    if (entityId) {
      acc[system_external_id].contacts.push(getContact(row));
    }
    return acc;
  }, {});

  return Object.values(licences);
}

/**
 * Get filter query
 * @param {Object} filter
 * @return {Object} Mongo query description
 */
function getMongoSqlQuery (filter) {
  return {
    type: 'select',
    table: 'crm.document_header',
    columns: ['*', 'crm.entity.entity_id', 'crm.entity.entity_nm', 'crm.entity.source', 'crm.entity_roles.role'],
    where: filter,
    joins: [{
      type: 'left',
      target: 'crm.entity_roles',
      on: {
        company_entity_id: '$crm.document_header.company_entity_id$',
        role: {
          $in: ['primary_user', 'user', 'notifications']
        }
      }
    },
    {
      type: 'left',
      target: 'crm.entity',
      on: { entity_id: '$crm.entity_roles.entity_id$' }
    }]
  };
}

/**
 * Get document contacts linked via document_entity table
 * @param {Object} mongo-sql query for finding documents
 * @return {Object} mongo-sql query with joins for doc entities, entities
 */
function getDocumentEntitySqlQuery (filter) {
  return {
    type: 'select',
    table: 'crm.document_header',
    columns: ['*', 'crm.entity.entity_id', 'crm.entity.entity_nm', 'crm.entity.source', 'crm.document_entity.role'],
    where: filter,
    joins: [{
      type: 'right',
      target: 'crm.document_entity',
      on: {
        document_id: '$crm.document_header.document_id$'
      }
    },
    {
      type: 'right',
      target: 'crm.entity',
      on: { entity_id: '$crm.document_entity.entity_id$' }
    }]
  };
}

/**
 * Get company entity linked via document's company_entity_id
 * @param {Object} mongo-sql query for finding documents
 * @return {Object} mongo-sql query with joins for doc entities, entities
 */
function getCompanySqlQuery (filter) {
  return {
    type: 'select',
    table: 'crm.document_header',
    columns: ['*', 'crm.entity.entity_id', 'crm.entity.entity_nm', 'crm.entity.source'],
    where: filter,
    joins: [{
      type: 'right',
      target: 'crm.entity',
      on: { entity_id: '$crm.document_header.company_entity_id$' }
    }]
  };
}

/**
 * Get contacts route handler
 * Gets a list of documents
 */
async function getContacts (request, h) {
  try {
    const filter = JSON.parse(request.query.filter || '{}');

    // Do initial query to find documents and entities linked via roles
    const query = getMongoSqlQuery(filter);
    const result = mongoSql.sql(query);
    const { rows, error } = await pool.query(result.toString(), result.values);

    if (error) {
      throw error;
    }

    // Do second query to find additional contacts linked to the documents
    // this will be the case for imported contacts
    const query2 = getDocumentEntitySqlQuery(filter);
    const result2 = mongoSql.sql(query2);
    const { rows: rows2, error: error2 } = await pool.query(result2.toString(), result2.values);
    if (error2) {
      throw error2;
    }

    // Do query to get company entities
    const query3 = getCompanySqlQuery(filter);
    const result3 = mongoSql.sql(query3);
    const { rows: rows3, error: error3 } = await pool.query(result3.toString(), result3.values);
    if (error3) {
      throw error3;
    }

    return {
      error,
      data: mapRowsToEntities([...rows, ...rows2, ...rows3])
    };
  } catch (error) {
    logger.error('getContacts error', error);
    h.response({ error, data: null }).code(500);
  }
}

const getDocumentsForContact = async (request, h) => {
  const { entity_id: entityId } = request.params;
  const sql = `
    select dh.system_external_id, dh.metadata, de.role, de.document_id
    from crm.document_header dh
    inner join crm.document_entity de
    on dh.document_id = de.document_id
    where de.entity_id = $1;`;

  try {
    const documents = await query(sql, [entityId]);
    return documents;
  } catch (error) {
    logger.error('getDocumentsForContact error', error);
    throw error;
  }
};

module.exports = {
  getContacts,
  getDocumentsForContact
};
