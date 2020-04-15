'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const uuid = require('uuid/v4');

const controller = require('../../../../src/v2/modules/companies/controller');
const companiesService = require('../../../../src/v2/services/companies');

experiment('modules/companies/controller', () => {
  let h;
  let created;

  beforeEach(async () => {
    created = sandbox.spy();
    h = {
      response: sandbox.stub().returns({ created })
    };

    sandbox.stub(companiesService, 'getCompany');
    sandbox.stub(companiesService, 'createPerson');
    sandbox.stub(companiesService, 'createOrganisation');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getCompany', () => {
    let response;
    let request;

    beforeEach(async () => {
      request = {
        params: {
          companyId: uuid()
        }
      };

      companiesService.getCompany.resolves({
        companyId: request.params.companyId,
        name: 'test-company'
      });

      response = await controller.getCompany(request);
    });

    test('calls through to the service with the company id', async () => {
      const [id] = companiesService.getCompany.lastCall.args;
      expect(id).to.equal(request.params.companyId);
    });

    test('return the found data', async () => {
      expect(response).to.equal({
        companyId: request.params.companyId,
        name: 'test-company'
      });
    });
  });

  experiment('.postCompany', () => {
    beforeEach(async () => {
      companiesService.createPerson.resolves({
        companyId: 'test-person-id',
        type: 'person'
      });

      companiesService.createOrganisation.resolves({
        companyId: 'test-company-id',
        type: 'organisation'
      });
    });

    experiment('when creating a person', () => {
      beforeEach(async () => {
        await controller.postCompany({
          payload: {
            type: 'person',
            name: 'test-name',
            isTest: true
          }
        }, h);
      });

      test('calls the expected service function', async () => {
        const [name, isTest] = companiesService.createPerson.lastCall.args;
        expect(name).to.equal('test-name');
        expect(isTest).to.equal(true);
      });

      test('returns the created entity in the response', async () => {
        const [result] = h.response.lastCall.args;

        expect(result).to.equal({
          companyId: 'test-person-id',
          type: 'person'
        });
      });

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args;
        expect(url).to.equal('/crm/2.0/companies/test-person-id');
      });
    });

    experiment('when creating an organisation', () => {
      beforeEach(async () => {
        await controller.postCompany({
          payload: {
            type: 'organisation',
            name: 'test-name',
            companyNumber: '123abc',
            isTest: true
          }
        }, h);
      });

      test('calls the expected service function', async () => {
        const [name, companyNumber, isTest] = companiesService.createOrganisation.lastCall.args;
        expect(name).to.equal('test-name');
        expect(companyNumber).to.equal('123abc');
        expect(isTest).to.equal(true);
      });

      test('returns the created entity in the response', async () => {
        const [result] = h.response.lastCall.args;

        expect(result).to.equal({
          companyId: 'test-company-id',
          type: 'organisation'
        });
      });

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args;
        expect(url).to.equal('/crm/2.0/companies/test-company-id');
      });
    });
  });
});
