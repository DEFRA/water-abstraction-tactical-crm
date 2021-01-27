'use strict';

const addressService = require('../../services/address');
const { wrapServiceCall } = require('../../lib/wrap-service-call');

exports.postAddress = wrapServiceCall(addressService, 'createAddress', request => [request.payload]);
