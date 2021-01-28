'use strict';

const controller = require('./controller');

const entityHandlers = require('../../lib/entity-handlers');
const validators = require('../../lib/validators');

exports.postInvoiceAccountAddress = {
  method: 'POST',
  path: '/crm/2.0/invoice-accounts/{invoiceAccountId}/addresses',
  handler: (request, h) => entityHandlers.createEntity(request, h, 'invoiceAccountAddress'),
  options: {
    description: 'Adds an address to an invoice account entity',
    validate: {
      params: {
        invoiceAccountId: validators.GUID
      },
      payload: {
        addressId: validators.GUID,
        startDate: validators.START_DATE,
        endDate: validators.END_DATE,
        agentCompanyId: validators.GUID.allow(null).default(null),
        contactId: validators.GUID.allow(null).default(null),
        isTest: validators.TEST_FLAG
      }
    }
  }
};

exports.deleteInvoiceAccountAddress = {
  method: 'DELETE',
  path: '/crm/2.0/invoice-account-addresses/{invoiceAccountAddressId}',
  handler: (request, h) => entityHandlers.deleteEntity(request, h, 'invoiceAccountAddress'),
  options: {
    description: 'Delete an invoice account address entity by id',
    validate: {
      params: {
        invoiceAccountId: validators.GUID,
        invoiceAccountAddressId: validators.GUID
      }
    }
  }
};

exports.patchInvoiceAccountAddress = {
  method: 'PATCH',
  path: '/crm/2.0/invoice-account-addresses/{invoiceAccountAddressId}',
  handler: controller.patchInvoiceAccountAddress,
  options: {
    description: 'Update an existing invoice account address',
    validate: {
      params: {
        invoiceAccountAddressId: validators.GUID
      },
      payload: {
        endDate: validators.NULLABLE_DATE
      }
    }
  }
};
