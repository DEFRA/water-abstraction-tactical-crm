const { pool } = require('../lib/connectors/db')
const ACCEPTANCE_TEST_SOURCE = 'acceptance-test-setup'
const config = require('../../config')

const deleteV2Documents = () => {
  return pool.query(`
   delete from
    crm_v2.documents
    where document_ref IN (SELECT system_external_id FROM crm.document_header
    where metadata->>'dataType' = '${ACCEPTANCE_TEST_SOURCE}');
    `)
}

const deleteDocuments = () => {
  return pool.query(`
    delete from
    crm.document_header
    where metadata->>'dataType' = '${ACCEPTANCE_TEST_SOURCE}'`)
}

const deleteEntityRoles = () => pool.query(`
  delete from
  crm.entity_roles
  where created_by = '${ACCEPTANCE_TEST_SOURCE}';`
)

const deleteEntities = () => pool.query(`
  delete from
  crm.entity
  where source = '${ACCEPTANCE_TEST_SOURCE}';`
)

const deleteCompanies = () => pool.query(`
  delete from crm_v2.companies where name = 'acceptance-test-company';
`)

const deleteAcceptanceTestDataDocuments = async (request, h) => {
  await deleteV2Documents()
  await deleteDocuments()
  return h.response().code(204)
}

const deleteAcceptanceTestDataEntities = async (request, h) => {
  await deleteEntityRoles()
  await deleteEntities()
  return h.response().code(204)
}

const deleteAcceptanceTestCompanies = async (request, h) => {
  await deleteCompanies()
  return h.response().code(204)
}

if (!config.isProduction) {
  exports.deleteAcceptanceTestDataDocuments = deleteAcceptanceTestDataDocuments
  exports.deleteAcceptanceTestDataEntities = deleteAcceptanceTestDataEntities
  exports.deleteAcceptanceTestCompanies = deleteAcceptanceTestCompanies
}
