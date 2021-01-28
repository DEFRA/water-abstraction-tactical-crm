'use strict';

const { wrapServiceCall } = require('../../lib/wrap-service-call');

const invoiceAccountAddressService = require('../../services/invoice-account-addresses');

exports.patchInvoiceAccountAddress = wrapServiceCall(invoiceAccountAddressService, 'updateInvoiceAccountAddress',
  request => [request.params.invoiceAccountAddressId, request.payload]);
