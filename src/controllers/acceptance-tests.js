const { pool } = require('../lib/connectors/db');
const ACCEPTANCE_TEST_SOURCE = 'acceptance-test-setup';
const config = require('../../config');

const deleteDocuments = () => {
  return pool.query(`
    delete from
    crm.document_header
    where metadata->>'dataType' = '${ACCEPTANCE_TEST_SOURCE}';`);
};

const deleteEntityRoles = () => pool.query(`
  delete from
  crm.entity_roles
  where created_by = '${ACCEPTANCE_TEST_SOURCE}';`
);

const deleteEntities = () => pool.query(`
  delete from
  crm.entity
  where source = '${ACCEPTANCE_TEST_SOURCE}';`
);

const deleteAcceptanceTestDataDocuments = async (request, h) => {
  await deleteDocuments();
  return h.response().code(204);
};

const deleteAcceptanceTestDataEntities = async (request, h) => {
  await deleteEntityRoles();
  await deleteEntities();
  return h.response().code(204);
};

if (config.isAcceptanceTestTarget) {
  exports.deleteAcceptanceTestDataDocuments = deleteAcceptanceTestDataDocuments;
  exports.deleteAcceptanceTestDataEntities = deleteAcceptanceTestDataEntities;
}
