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
const errors = require('../../../../src/v2/lib/errors');

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
    sandbox.stub(companiesService, 'addAddress');
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

  experiment('.postCompanyAddress', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      },
      payload: {
        addressId: 'test-address-id',
        roleId: 'test-role-id',
        startDate: '2020-01-01',
        isTest: true
      }
    };

    beforeEach(async () => {
      companiesService.addAddress.resolves({
        companyAddressId: 'test-company-address-id'
      });
    });

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        await controller.postCompanyAddress(request, h);
      });

      test('the service is called with the right params', async () => {
        expect(companiesService.addAddress.calledWith(
          'test-company-id',
          'test-address-id',
          {
            roleId: 'test-role-id',
            startDate: '2020-01-01'
          },
          true
        )).to.be.true();
      });

      test('returns the created company address in the response', async () => {
        const [result] = h.response.lastCall.args;

        expect(result).to.equal({
          companyAddressId: 'test-company-address-id'
        });
      });

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args;
        expect(url).to.equal('/crm/2.0/companies/test-company-id/addresses/test-company-address-id');
      });
    });

    experiment('when there is a unique constraint violation', () => {
      let response;

      beforeEach(async () => {
        companiesService.addAddress.rejects(new errors.UniqueConstraintViolation());
        response = await controller.postCompanyAddress(request, h);
      });

      test('a Boom conflict error is returned', async () => {
        expect(response.isBoom).to.be.true();
        expect(response.output.statusCode).to.equal(409);
      });
    });

    experiment('when there is an unknown error', () => {
      beforeEach(async () => {
        companiesService.addAddress.rejects(new Error('oops'));
      });

      test('an error is thrown', async () => {
        const func = () => controller.postCompanyAddress(request, h);
        expect(func()).to.reject();
      });
    });
  });
});
