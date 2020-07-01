const { mapErrorResponse } = require('./map-error-response');

const wrapServiceCall = (service, method, mapRequest) => async request => {
  try {
    const data = await service[method](...mapRequest(request));
    return data;
  } catch (err) {
    return mapErrorResponse(err);
  }
};

exports.wrapServiceCall = wrapServiceCall;
