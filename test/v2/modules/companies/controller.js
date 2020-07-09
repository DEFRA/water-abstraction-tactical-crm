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
const rolesRepo = require('../../../../src/v2/connectors/repository/roles');
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
    sandbox.stub(companiesService, 'addContact');
    sandbox.stub(companiesService, 'getAddresses');
    sandbox.stub(companiesService, 'getContacts');
    sandbox.stub(rolesRepo, 'findOneByName').resolves({ roleId: 'test-role-id' });
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
            organisationType: 'partnership',
            isTest: true
          }
        }, h);
      });

      test('calls the expected service function', async () => {
        const [name, companyNumber, organisationType, isTest] = companiesService.createOrganisation.lastCall.args;
        expect(name).to.equal('test-name');
        expect(companyNumber).to.equal('123abc');
        expect(organisationType).to.equal('partnership');
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
        roleName: 'test-role-name',
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

      test('calls the rolesRepo with the roleName to get the roleId', () => {
        expect(rolesRepo.findOneByName.calledWith(
          'test-role-name'
        )).to.be.true();
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

  experiment('.postCompanyContact', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      },
      payload: {
        contactId: 'test-contact-id',
        roleName: 'test-role-name',
        startDate: '2020-01-01',
        isTest: true
      }
    };

    beforeEach(async () => {
      companiesService.addContact.resolves({
        companyContactId: 'test-company-contact-id'
      });
    });

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        await controller.postCompanyContact(request, h);
      });

      test('calls the rolesRepo with the roleName to get the roleId', () => {
        expect(rolesRepo.findOneByName.calledWith(
          'test-role-name'
        )).to.be.true();
      });

      test('the service is called with the right params', async () => {
        expect(companiesService.addContact.calledWith(
          'test-company-id',
          'test-contact-id',
          {
            roleId: 'test-role-id',
            startDate: '2020-01-01'
          },
          true
        )).to.be.true();
      });

      test('returns the created company contact in the response', async () => {
        const [result] = h.response.lastCall.args;

        expect(result).to.equal({
          companyContactId: 'test-company-contact-id'
        });
      });

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args;
        expect(url).to.equal('/crm/2.0/companies/test-company-id/contacts/test-company-contact-id');
      });
    });

    experiment('when there is a unique constraint violation', () => {
      let response;

      beforeEach(async () => {
        companiesService.addContact.rejects(new errors.UniqueConstraintViolation());
        response = await controller.postCompanyContact(request, h);
      });

      test('a Boom conflict error is returned', async () => {
        expect(response.name).to.equal('Error');
        expect(response.isBoom).to.be.true();
        expect(response.output.statusCode).to.equal(409);
        expect(response.message).to.equal('Conflict');
        expect(response.output.payload.error).to.equal('Conflict');
      });
    });

    experiment('when there is a foreign key constraint violation', () => {
      let response;

      beforeEach(async () => {
        companiesService.addContact.rejects(new errors.ForeignKeyConstraintViolation());
        response = await controller.postCompanyContact(request, h);
      });

      test('a Boom conflict error is returned', async () => {
        expect(response.name).to.equal('Error');
        expect(response.isBoom).to.be.true();
        expect(response.output.statusCode).to.equal(409);
        expect(response.message).to.equal('Conflict');
        expect(response.output.payload.error).to.equal('Conflict');
      });
    });

    experiment('when there is an unknown error', () => {
      beforeEach(async () => {
        companiesService.addContact.rejects(new Error('oops'));
      });

      test('an error is thrown', async () => {
        const func = () => controller.postCompanyContact(request, h);
        expect(func()).to.reject();
      });
    });
  });

  experiment('.getCompanyAddresses', () => {
    let result;
    const request = {
      params: {
        companyId: 'test-company-id'
      }
    };

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        companiesService.getAddresses.resolves([{
          companyAddressId: 'test-company-address-1'
        }]);
        result = await controller.getCompanyAddresses(request);
      });

      test('the service method .getAddresses is called with the correct ID', async () => {
        expect(companiesService.getAddresses.calledWith(
          request.params.companyId
        )).to.be.true();
      });

      test('the company addresses are returned with no envelope', async () => {
        expect(result[0].companyAddressId).to.equal('test-company-address-1');
      });
    });

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        companiesService.getAddresses.rejects(new errors.NotFoundError('Company not found'));
        result = await controller.getCompanyAddresses(request);
      });

      test('the controller resolves with a Boom 404', async () => {
        expect(result.isBoom).to.be.true();
        expect(result.output.statusCode).to.equal(404);
      });
    });
  });

  experiment('.getCompanyContacts', () => {
    let result;
    const request = {
      params: {
        companyId: 'test-company-id'
      }
    };

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        companiesService.getContacts.resolves([{
          companyContactId: 'test-company-contact-1'
        }]);
        result = await controller.getCompanyContacts(request);
      });

      test('the service method .getContacts is called with the correct ID', async () => {
        expect(companiesService.getContacts.calledWith(
          request.params.companyId
        )).to.be.true();
      });

      test('the company contacts are returned with no envelope', async () => {
        expect(result[0].companyContactId).to.equal('test-company-contact-1');
      });
    });

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        companiesService.getContacts.rejects(new errors.NotFoundError('Company not found'));
        result = await controller.getCompanyContacts(request);
      });

      test('the controller resolves with a Boom 404', async () => {
        expect(result.isBoom).to.be.true();
        expect(result.output.statusCode).to.equal(404);
      });
    });
  });
});
