'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const controller = require('../../../../src/v2/modules/test-data/controller');
const testDataService = require('../../../../src/v2/services/test-data');

experiment('v2/modules/test-data/controller', () => {
  let code;
  let h;

  beforeEach(async () => {
    code = sandbox.spy();

    h = {
      response: sandbox.stub().returns({
        code
      })
    };

    sandbox.stub(testDataService, 'deleteAllTestData').resolves();
    await controller.deleteTestData({}, h);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.deleteTestData', () => {
    test('calls through to the testDataService', async () => {
      expect(testDataService.deleteAllTestData.called).to.equal(true);
    });

    test('returns an empty response', async () => {
      const [responseCode] = code.lastCall.args;
      expect(responseCode).to.equal(204);
    });
  });
});
