'use strict';

const {
  experiment,
  test
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');

const routes = require('../../../src/modules/kpi-reporting/routes');

experiment('modules/kpi-reporting/routes', () => {
  test('the handler is delegated to the entity handler', async () => {
    expect(routes[0].method).to.equal('GET');
    expect(routes[0].path).to.equal('/crm/1.0/kpi/access-requests');
  });
});
