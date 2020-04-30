'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const documentsRepo = require('../../../../src/v2/connectors/repository/documents');
const Document = require('../../../../src/v2/connectors/bookshelf/Document');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/document-roles', () => {
  beforeEach(async () => {
    sandbox.stub(repoHelpers, 'deleteTestData');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await documentsRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(Document);
    });
  });
});
