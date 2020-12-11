const { version } = require('../../config');
const controller = require('../controllers/acceptance-tests');
const config = require('../../config');

if (config.isAcceptanceTestTarget) {
  exports.acceptanceTestTearDownDocuments = {
    method: 'DELETE',
    path: `/crm/${version}/acceptance-tests/documents`,
    handler: controller.deleteAcceptanceTestDataDocuments,
    options: {
      description: 'Deletes any document data setup for acceptance test execution'
    }
  };

  exports.acceptanceTestTearDownEntities = {
    method: 'DELETE',
    path: `/crm/${version}/acceptance-tests/entities`,
    handler: controller.deleteAcceptanceTestDataEntities,
    options: {
      description: 'Deletes any entity data setup for acceptance test execution'
    }
  };

  exports.acceptanceTestTearDownCRMV2Entities = {
    method: 'DELETE',
    path: '/crm/2.0/acceptance-tests/companies',
    handler: controller.deleteAcceptanceTestCompanies,
    options: {
      description: 'Deletes any company data setup for acceptance test execution'
    }
  };
}
