'use strict';
const pluralize = require('pluralize');
const { mapErrorResponse } = require('./map-error-response');

const isPost = request => request.method.toLowerCase() === 'post';

const getEntityName = method => method.replace('create', '').toLowerCase();

const getIdProperty = method => `${getEntityName(method)}Id`;

const wrapServiceCall = (service, method, mapRequest) => async (request, h) => {
  try {
    const data = await service[method](...mapRequest(request));

    if (isPost(request)) {
      const entityName = getEntityName(method);
      const idProperty = getIdProperty(method);
      const path = `/crm/2.0/${pluralize(entityName)}/${data[idProperty]}`;
      return h.response(data)
        .created(path);
    }

    return data;
  } catch (err) {
    return mapErrorResponse(err);
  }
};

exports.wrapServiceCall = wrapServiceCall;
