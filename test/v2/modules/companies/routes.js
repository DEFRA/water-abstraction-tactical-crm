'use strict';

const uuid = require('uuid/v4');

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script();
const querystring = require('querystring');
const { expect } = require('@hapi/code');
const routes = require('../../../../src/v2/modules/companies/routes');
const { createServerForRoute } = require('../../../helpers');

experiment('modules/companies/routes', () => {
  experiment('getCompany', () => {
    let server;

    const getRequest = companyId => ({
      method: 'GET',
      url: `/crm/2.0/companies/${companyId}`
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.getCompany);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('searchCompaniesByName', () => {
    let server;

    const getRequest = (name, soft = false) => ({
      method: 'GET',
      url: `/crm/2.0/companies/search?${querystring.stringify({
        name: name,
        soft: soft
      })}`
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.getCompanyByName);
    });

    test('returns a 400 if a search string is not provided', async () => {
      const request = getRequest();
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if a search string is valid', async () => {
      const request = getRequest('hen');
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('createCompany', () => {
    let server;

    const getRequest = payload => ({
      method: 'POST',
      url: '/crm/2.0/companies',
      payload
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.createCompany);
    });

    experiment('when a person is being created', () => {
      test('isTest can be omitted', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'person'
        });

        const response = await server.inject(request);

        expect(response.payload).to.equal('ok');
        expect(response.statusCode).to.equal(200);
      });

      test('isTest must be boolean', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'person',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be supplied', async () => {
        const request = getRequest({
          type: 'person',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be a string', async () => {
        const request = getRequest({
          name: 123,
          type: 'person'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('cannot have a company number', async () => {
        const request = getRequest({
          name: 'Name',
          type: 'person',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('cannot have an organisation type', async () => {
        const request = getRequest({
          name: 'Name',
          type: 'person',
          organisationType: 'individual'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });
    });

    experiment('when an organisation is being created', () => {
      test('isTest can be omitted', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.payload).to.equal('ok');
        expect(response.statusCode).to.equal(200);
      });

      test('isTest must be boolean', async () => {
        const request = getRequest({
          name: 'Timmy Test',
          type: 'organisation',
          isTest: 'Sure is!'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be supplied', async () => {
        const request = getRequest({
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('the name must be a string', async () => {
        const request = getRequest({
          name: 123,
          type: 'organisation'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(400);
      });

      test('can have a company number', async () => {
        const request = getRequest({
          name: 'Cash Inc',
          type: 'organisation',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
      });

      test('can have an organisation type', async () => {
        const request = getRequest({
          name: 'Cash Inc',
          type: 'organisation',
          organisationType: 'partnership'
        });

        const response = await server.inject(request);

        expect(response.statusCode).to.equal(200);
      });

      test('isTest defaults to false', async () => {
        const request = getRequest({
          name: 'Cash Inc',
          type: 'organisation',
          companyNumber: '123acb'
        });

        const response = await server.inject(request);

        expect(response.request.payload.isTest).to.equal(false);
      });
    });
  });

  experiment('postCompanyAddress', async () => {
    let server;

    const getRequest = (companyId, payload = {}) => ({
      method: 'POST',
      url: `/crm/2.0/companies/${companyId}/addresses`,
      payload
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.postCompanyAddress);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123, {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the address id is not a uuid', async () => {
      const request = getRequest(uuid(), {
        addressId: 123,
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the address id is omitted', async () => {
      const request = getRequest(uuid(), {
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('role name can be set to "licenceHolder"', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('role name can be set to "billing"', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'billing',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if the role name is an unexpected value', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'abstractor',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the role name is omitted', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the start date is not valid', async () => {
      const request = getRequest(uuid(), {
        addressId: 123,
        roleName: 'licenceHolder',
        startDate: '2020-01-45'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the start date is omitted', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('end date defaults to null if not provided', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.endDate).to.equal(null);
    });

    test('end date can be set to null', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: null
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('end date can be set to a valid date', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2020-03-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if end date is before start date', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2019-12-31'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if end date is invalid date', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2020-02-30'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('isDefault defaults to false', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.isDefault).to.equal(false);
    });

    test('isDefault can be set to a boolean', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isDefault: true
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if isDefault is not a boolean', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isDefault: 'oops'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('isTest defaults to false', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.isTest).to.equal(false);
    });

    test('isTest can be set to a boolean', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isTest: true
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if isTest is not a boolean', async () => {
      const request = getRequest(uuid(), {
        addressId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isTest: 'oops'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('postCompanyContact', async () => {
    let server;

    const getRequest = (companyId, payload = {}) => ({
      method: 'POST',
      url: `/crm/2.0/companies/${companyId}/contacts`,
      payload
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.postCompanyContact);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123, {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the contact id is not a uuid', async () => {
      const request = getRequest(uuid(), {
        contactId: 123,
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the contactId id is omitted', async () => {
      const request = getRequest(uuid(), {
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('role name can be set to "licenceHolder"', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('role name can be set to "billing"', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'billing',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if the role name is an unexpected value', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'abstractor',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the role name is omitted', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the start date is not valid', async () => {
      const request = getRequest(uuid(), {
        contactId: 123,
        roleName: 'licenceHolder',
        startDate: '2020-01-45'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if the start date is omitted', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleId: uuid()
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('end date defaults to null if not provided', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.endDate).to.equal(null);
    });

    test('end date can be set to null', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: null
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('end date can be set to a valid date', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2020-03-01'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if end date is before start date', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2019-12-31'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if end date is invalid date', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        endDate: '2020-02-30'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('isDefault defaults to false', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.isDefault).to.equal(false);
    });

    test('isDefault can be set to a boolean', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isDefault: true
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if isDefault is not a boolean', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isDefault: 'oops'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('isTest defaults to false', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01'
      });
      const response = await server.inject(request);
      expect(response.request.payload.isTest).to.equal(false);
    });

    test('isTest can be set to a boolean', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isTest: true
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if isTest is not a boolean', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        isTest: 'oops'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 400 if email is not a valid email address', async () => {
      const request = getRequest(uuid(), {
        contactId: uuid(),
        roleName: 'licenceHolder',
        startDate: '2020-01-01',
        emailAddress: 'invalidEmail'
      });
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });
  });

  experiment('deleteCompany', () => {
    let server;

    const getRequest = companyId => ({
      method: 'DELETE',
      url: `/crm/2.0/companies/${companyId}`
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.deleteCompany);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the company id is a uuid', async () => {
      const request = getRequest(uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('deleteCompanyAddress', () => {
    let server;

    const getRequest = (companyId, companyAddressId) => ({
      method: 'DELETE',
      url: `/crm/2.0/companies/${companyId}/addresses/${companyAddressId}`
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.deleteCompanyAddress);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123, uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the company id is a uuid', async () => {
      const request = getRequest(uuid(), uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if the company address id is not a uuid', async () => {
      const request = getRequest(uuid(), 123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the company address id is a uuid', async () => {
      const request = getRequest(uuid(), uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });

  experiment('deleteCompanyContact', () => {
    let server;

    const getRequest = (companyId, companyContactId) => ({
      method: 'DELETE',
      url: `/crm/2.0/companies/${companyId}/contacts/${companyContactId}`
    });

    beforeEach(async () => {
      server = createServerForRoute(routes.deleteCompanyContact);
    });

    test('returns a 400 if the company id is not a uuid', async () => {
      const request = getRequest(123, uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the company id is a uuid', async () => {
      const request = getRequest(uuid(), uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });

    test('returns a 400 if the company contact id is not a uuid', async () => {
      const request = getRequest(uuid(), 123);
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(400);
    });

    test('returns a 200 if the company contact id is a uuid', async () => {
      const request = getRequest(uuid(), uuid());
      const response = await server.inject(request);
      expect(response.statusCode).to.equal(200);
    });
  });
});
