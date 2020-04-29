'use strict';

const testDataService = require('../../services/test-data');

const deleteTestData = async (request, h) => {
  await testDataService.deleteAllTestData();
  return h.response().code(204);
};

exports.deleteTestData = deleteTestData;
