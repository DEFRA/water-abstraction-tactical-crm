'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const uuid = require('uuid/v4');
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const errors = require('../../../src/v2/lib/errors');
const entityHandlers = require('../../../src/v2/lib/entity-handlers');
const addressService = require('../../../src/v2/services/address');
const contactsService = require('../../../src/v2/services/contacts');
const invoiceAccountsService = require('../../../src/v2/services/invoice-accounts');
const invoiceAccountAddressesService = require('../../../src/v2/services/invoice-account-addresses');
const documentsService = require('../../../src/v2/services/documents');
const companiesService = require('../../../src/v2/services/companies');

experiment('v2/lib/entity-handlers', () => {
  let result;
  let h;
  let request;
  let responseStub;

  beforeEach(async () => {
    responseStub = {
      created: sandbox.spy(),
      code: sandbox.spy()
    };
    h = {
      response: sandbox.stub().returns(responseStub)
    };

    sandbox.stub(addressService, 'createAddress');
    sandbox.stub(addressService, 'getAddress');
    sandbox.stub(addressService, 'deleteAddress');
    sandbox.stub(contactsService, 'createContact');
    sandbox.stub(contactsService, 'getContact');
    sandbox.stub(contactsService, 'deleteContact');
    sandbox.stub(documentsService, 'createDocument');
    sandbox.stub(documentsService, 'getDocument');
    sandbox.stub(invoiceAccountsService, 'getInvoiceAccount');
    sandbox.stub(invoiceAccountsService, 'createInvoiceAccount');
    sandbox.stub(invoiceAccountsService, 'deleteInvoiceAccount');
    sandbox.stub(invoiceAccountAddressesService, 'createInvoiceAccountAddress');
    sandbox.stub(invoiceAccountAddressesService, 'deleteInvoiceAccountAddress');
    sandbox.stub(invoiceAccountAddressesService, 'updateInvoiceAccountAddress');
    sandbox.stub(documentsService, 'createDocumentRole');
    sandbox.stub(documentsService, 'getDocumentRole');
    sandbox.stub(companiesService, 'deleteCompany');
    sandbox.stub(companiesService, 'deleteCompanyAddress');
    sandbox.stub(companiesService, 'deleteCompanyContact');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.createEntity', () => {
    test('throws an error for an unknown entity key', async () => {
      const error = await expect(entityHandlers.createEntity({}, {}, 'potatoes')).to.reject();
      expect(error.message).to.equal('Unknown key (potatoes) passed to entity-handlers');
    });

    experiment('when creating an address', () => {
      experiment('if the address is valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/addresses',
            payload: {
              address1: 'test-address-1'
            }
          };

          addressService.createAddress.resolves({
            addressId: 'test-address-id'
          });

          await entityHandlers.createEntity(request, h, 'address');
        });

        test('the payload is passed to the service', async () => {
          const [entity] = addressService.createAddress.lastCall.args;
          expect(entity.address1).to.equal('test-address-1');
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.addressId).to.equal('test-address-id');
        });

        test('the location header points to the saved entity', async () => {
          const [location] = responseStub.created.lastCall.args;
          expect(location).to.equal('/crm/2.0/addresses/test-address-id');
        });
      });

      experiment('if the address is not valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/addresses',
            payload: {
              address1: 'test-address-1'
            }
          };

          const validationError = new errors.EntityValidationError(
            'Address not valid',
            ['fail-1', 'fail-2']
          );

          addressService.createAddress.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'address');
        });

        test('a Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Address not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });

    experiment('when creating a contact', () => {
      experiment('if the contact is valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts',
            payload: {
              firstName: 'test-first-1',
              lastName: 'test-last-1'
            }
          };

          contactsService.createContact.resolves({
            contactId: 'test-contact-id'
          });

          await entityHandlers.createEntity(request, h, 'contact');
        });

        test('the payload is passed to the service', async () => {
          const [entity] = contactsService.createContact.lastCall.args;
          expect(entity.firstName).to.equal('test-first-1');
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.contactId).to.equal('test-contact-id');
        });

        test('the location header points to the saved entity', async () => {
          const [location] = responseStub.created.lastCall.args;
          expect(location).to.equal('/crm/2.0/contacts/test-contact-id');
        });
      });

      experiment('if the contact is not valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts',
            payload: {
              firstName: 'test-first-1'
            }
          };

          const validationError = new errors.EntityValidationError(
            'Contact not valid',
            ['fail-1', 'fail-2']
          );

          contactsService.createContact.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'contact');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Contact not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });

    experiment('when creating an invoice account', () => {
      experiment('if the invoice account is valid', () => {
        let companyId;

        beforeEach(async () => {
          companyId = uuid();
          request = {
            path: '/crm/2.0/invoice-accounts',
            payload: {
              companyId,
              invoiceAccountNumber: 'A12345678A',
              startDate: '2020-04-01'
            }
          };

          invoiceAccountsService.createInvoiceAccount.resolves({
            invoiceAccountId: 'test-invoice-account-id'
          });

          await entityHandlers.createEntity(request, h, 'invoiceAccount');
        });

        test('the payload is passed to the service', async () => {
          const [entity] = invoiceAccountsService.createInvoiceAccount.lastCall.args;
          expect(entity.companyId).to.equal(companyId);
          expect(entity.invoiceAccountNumber).to.equal('A12345678A');
          expect(entity.startDate).to.equal('2020-04-01');
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.invoiceAccountId).to.equal('test-invoice-account-id');
        });
      });

      experiment('if the invoice account is not valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/invoice-accounts',
            payload: {
              invoiceAccountNumber: 'A12345678A',
              startDate: '2020-04-01'
            }
          };

          const validationError = new errors.EntityValidationError(
            'Invoice account not valid',
            ['fail-1', 'fail-2']
          );

          invoiceAccountsService.createInvoiceAccount.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'invoiceAccount');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Invoice account not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });

    experiment('when creating an invoice account address', () => {
      experiment('if the invoice account address is valid', () => {
        let invoiceAccountId, addressId, invoiceAccountAddressId;

        beforeEach(async () => {
          invoiceAccountId = uuid();
          addressId = uuid();
          request = {
            path: `/crm/2.0/invoice-accounts/${invoiceAccountId}/addresses`,
            params: {
              invoiceAccountId
            },
            payload: {
              addressId,
              startDate: '2020-04-01'
            }
          };
          invoiceAccountAddressId = 'test-invoice-account-address-id';
          invoiceAccountAddressesService.createInvoiceAccountAddress.resolves({ invoiceAccountAddressId });

          await entityHandlers.createEntity(request, h, 'invoiceAccountAddress');
        });

        test('the payload is passed to the service', async () => {
          const [entity] = invoiceAccountAddressesService.createInvoiceAccountAddress.lastCall.args;
          expect(entity.addressId).to.equal(addressId);
          expect(entity.startDate).to.equal('2020-04-01');
        });

        test('the params are passed to the service', async () => {
          const [entity] = invoiceAccountAddressesService.createInvoiceAccountAddress.lastCall.args;
          expect(entity.invoiceAccountId).to.equal(invoiceAccountId); ;
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.invoiceAccountAddressId).to.equal(invoiceAccountAddressId);
        });
      });

      experiment('if the invoice account address is not valid', () => {
        let invoiceAccountId;

        beforeEach(async () => {
          invoiceAccountId = uuid();
          request = {
            path: `/crm/2.0/invoice-accounts/${invoiceAccountId}/addresses`,
            payload: {
              startDate: '2020-04-01'
            }
          };

          const validationError = new errors.EntityValidationError(
            'Invoice account address not valid',
            ['fail-1', 'fail-2']
          );

          invoiceAccountAddressesService.createInvoiceAccountAddress.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'invoiceAccountAddress');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Invoice account address not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });

    experiment('when creating a document role', () => {
      let documentId;
      let documentRoleId;

      experiment('if the document role is valid', () => {
        beforeEach(async () => {
          documentId = uuid();
          documentRoleId = uuid();

          request = {
            path: `/crm/2.0/documents/${documentId}/role`,
            params: {
              documentId
            },
            payload: {
              role: 'billing',
              startDate: new Date(2000, 0, 1),
              invoiceAccountId: uuid()
            }
          };

          documentsService.createDocumentRole.resolves({ documentRoleId });

          await entityHandlers.createEntity(
            request,
            h,
            'documentRole',
            entity => `/crm/2.0/document-roles/${entity.documentRoleId}`
          );
        });

        test('the payload is passed to the service', async () => {
          const [entity] = documentsService.createDocumentRole.lastCall.args;
          expect(entity.role).to.equal('billing');
        });

        test('the params are passed to the service', async () => {
          const [entity] = documentsService.createDocumentRole.lastCall.args;
          expect(entity.documentId).to.equal(documentId);
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.documentRoleId).to.equal(documentRoleId);
        });

        test('the location header points to the saved entity using a callback', async () => {
          const [location] = responseStub.created.lastCall.args;
          expect(location).to.equal(`/crm/2.0/document-roles/${documentRoleId}`);
        });
      });

      experiment('if the document role is not valid', () => {
        beforeEach(async () => {
          request = {
            path: `/crm/2.0/documents/${documentId}/role`,
            params: {
              documentId
            },
            payload: {
              role: 'licenceHolder',
              startDate: new Date(2000, 0, 1),
              invoiceAccountId: uuid()
            }
          };

          const validationError = new errors.EntityValidationError(
            'Document Role not valid',
            ['fail-1', 'fail-2']
          );

          documentsService.createDocumentRole.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'documentRole');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Document Role not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });
  });

  experiment('.getEntity', () => {
    test('throws an error for an unknown entity key', async () => {
      const error = await expect(entityHandlers.getEntity({}, 'potatoes')).to.reject();
      expect(error.message).to.equal('Unknown key (potatoes) passed to entity-handlers');
    });

    experiment('when fetching an address', () => {
      experiment('if the address exists', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/addresses/test-address-1',
            params: {
              addressId: 'test-address-1'
            }
          };

          addressService.getAddress.resolves({
            addressId: 'test-address-id',
            address1: 'test-address-1'
          });

          result = await entityHandlers.getEntity(request, 'address');
        });

        test('the id is passed to the service', async () => {
          const [id] = addressService.getAddress.lastCall.args;
          expect(id).to.equal('test-address-1');
        });

        test('the entity is returned', async () => {
          expect(result.addressId).to.equal('test-address-id');
          expect(result.address1).to.equal('test-address-1');
        });
      });

      experiment('if the address is not found', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/addresses/test-address-1',
            params: {
              addressId: 'test-address-1'
            }
          };

          addressService.getAddress.resolves(null);

          result = await entityHandlers.getEntity(request, 'address');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(404);
          expect(result.output.payload.message).to.equal('No address found for test-address-1');
        });
      });
    });

    experiment('when fetching a contact', () => {
      experiment('if the contact exists', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts/test-contact-1',
            params: {
              contactId: 'test-contact-1'
            }
          };

          contactsService.getContact.resolves({
            contactId: 'test-contact-id',
            firstName: 'Firsty'
          });

          result = await entityHandlers.getEntity(request, 'contact');
        });

        test('the id is passed to the service', async () => {
          const [id] = contactsService.getContact.lastCall.args;
          expect(id).to.equal('test-contact-1');
        });

        test('the entity is returned', async () => {
          expect(result.contactId).to.equal('test-contact-id');
          expect(result.firstName).to.equal('Firsty');
        });
      });

      experiment('if the contact is not found', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts/test-contact-1',
            params: {
              contactId: 'test-contact-1'
            }
          };

          contactsService.getContact.resolves(null);

          result = await entityHandlers.getEntity(request, 'contact');
        });

        test('a Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(404);
          expect(result.output.payload.message).to.equal('No contact found for test-contact-1');
        });
      });
    });

    experiment('when fetching a document role', () => {
      let documentRoleId;

      experiment('if the document role exists', () => {
        documentRoleId = uuid();

        beforeEach(async () => {
          request = {
            path: `/crm/2.0/document-roles/${documentRoleId}`,
            params: {
              documentRoleId
            }
          };

          documentsService.getDocumentRole.resolves({
            documentRoleId,
            role: 'billing'
          });

          result = await entityHandlers.getEntity(request, 'documentRole');
        });

        test('the id is passed to the service', async () => {
          const [id] = documentsService.getDocumentRole.lastCall.args;
          expect(id).to.equal(documentRoleId);
        });

        test('the entity is returned', async () => {
          expect(result.documentRoleId).to.equal(documentRoleId);
          expect(result.role).to.equal('billing');
        });
      });

      experiment('if the document role is not found', () => {
        beforeEach(async () => {
          request = {
            path: `/crm/2.0/document-roles/${documentRoleId}`,
            params: {
              documentRoleId
            }
          };

          documentsService.getDocumentRole.resolves(null);

          result = await entityHandlers.getEntity(request, 'documentRole');
        });

        test('a Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(404);
          expect(result.output.payload.message).to.equal(`No document role found for ${documentRoleId}`);
        });
      });
    });

    experiment('when creating a contact', () => {
      experiment('if the contact is valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts',
            payload: {
              firstName: 'test-first-1',
              lastName: 'test-last-1'
            }
          };

          contactsService.createContact.resolves({
            contactId: 'test-contact-id'
          });

          await entityHandlers.createEntity(request, h, 'contact');
        });

        test('the payload is passed to the service', async () => {
          const [entity] = contactsService.createContact.lastCall.args;
          expect(entity.firstName).to.equal('test-first-1');
        });

        test('the saved entity is returned in the response body', async () => {
          const [entity] = h.response.lastCall.args;
          expect(entity.contactId).to.equal('test-contact-id');
        });

        test('the location header points to the saved entity', async () => {
          const [location] = responseStub.created.lastCall.args;
          expect(location).to.equal('/crm/2.0/contacts/test-contact-id');
        });
      });

      experiment('if the contact is not valid', () => {
        beforeEach(async () => {
          request = {
            path: '/crm/2.0/contacts',
            payload: {
              firstName: 'test-first-1'
            }
          };

          const validationError = new errors.EntityValidationError(
            'Contact not valid',
            ['fail-1', 'fail-2']
          );

          contactsService.createContact.rejects(validationError);

          result = await entityHandlers.createEntity(request, h, 'contact');
        });

        test('an Boom error is returned', async () => {
          expect(result.output.payload.statusCode).to.equal(422);
          expect(result.output.payload.message).to.equal('Contact not valid');
          expect(result.output.payload.validationDetails).to.equal(['fail-1', 'fail-2']);
        });
      });
    });
  });

  experiment('.deleteEntity', () => {
    test('throws an error for an unknown entity key', async () => {
      const error = await expect(entityHandlers.deleteEntity({}, h, 'potatoes')).to.reject();
      expect(error.message).to.equal('Unknown key (potatoes) passed to entity-handlers');
    });

    experiment('when deleting an address', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/addresses/test-address-1',
          params: {
            addressId: 'test-address-1'
          }
        };

        addressService.deleteAddress.resolves();

        await entityHandlers.deleteEntity(request, h, 'address');
      });

      test('the id is passed to the service', async () => {
        const [id] = addressService.deleteAddress.lastCall.args;
        expect(id).to.equal('test-address-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting a contact', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/contacts/test-contact-1',
          params: {
            contactId: 'test-contact-1'
          }
        };

        contactsService.deleteContact.resolves();

        await entityHandlers.deleteEntity(request, h, 'contact');
      });

      test('the id is passed to the service', async () => {
        const [id] = contactsService.deleteContact.lastCall.args;
        expect(id).to.equal('test-contact-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting an invoice account', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/invoice-accounts/test-invoice-account-1',
          params: {
            invoiceAccountId: 'test-invoice-account-1'
          }
        };

        invoiceAccountsService.deleteInvoiceAccount.resolves();

        await entityHandlers.deleteEntity(request, h, 'invoiceAccount');
      });

      test('the id is passed to the service', async () => {
        const [id] = invoiceAccountsService.deleteInvoiceAccount.lastCall.args;
        expect(id).to.equal('test-invoice-account-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting an invoice account address', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/invoice-accounts/test-invoice-account-id/addresses/test-invoice-account-address-1',
          params: {
            invoiceAccountAddressId: 'test-invoice-account-address-1'
          }
        };

        invoiceAccountAddressesService.deleteInvoiceAccountAddress.resolves();

        await entityHandlers.deleteEntity(request, h, 'invoiceAccountAddress');
      });

      test('the id is passed to the service', async () => {
        const [id] = invoiceAccountAddressesService.deleteInvoiceAccountAddress.lastCall.args;
        expect(id).to.equal('test-invoice-account-address-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting a company', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/companies/test-company-1',
          params: {
            companyId: 'test-company-1'
          }
        };

        companiesService.deleteCompany.resolves();

        await entityHandlers.deleteEntity(request, h, 'company');
      });

      test('the id is passed to the service', async () => {
        const [id] = companiesService.deleteCompany.lastCall.args;
        expect(id).to.equal('test-company-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting a company address', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/companies/test-company/addresses/test-company-address-1',
          params: {
            companyAddressId: 'test-company-address-1'
          }
        };

        companiesService.deleteCompanyAddress.resolves();

        await entityHandlers.deleteEntity(request, h, 'companyAddress');
      });

      test('the id is passed to the service', async () => {
        const [id] = companiesService.deleteCompanyAddress.lastCall.args;
        expect(id).to.equal('test-company-address-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });

    experiment('when deleting a company contact', () => {
      beforeEach(async () => {
        request = {
          path: '/crm/2.0/companies/test-company/contacts/test-company-contact-1',
          params: {
            companyContactId: 'test-company-contact-1'
          }
        };

        companiesService.deleteCompanyContact.resolves();

        await entityHandlers.deleteEntity(request, h, 'companyContact');
      });

      test('the id is passed to the service', async () => {
        const [id] = companiesService.deleteCompanyContact.lastCall.args;
        expect(id).to.equal('test-company-contact-1');
      });

      test('the a 204 code is returned', async () => {
        const [code] = responseStub.code.lastCall.args;
        expect(code).to.equal(204);
      });
    });
  });
});
