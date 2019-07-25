const { experiment, test } = exports.lab = require('lab').script();
const { expect } = require('code');
const server = require('../../index');

experiment('/status', () => {
  test('responds with a status code of 200', async () => {
    const request = { method: 'get', url: '/status' };
    const response = await server.inject(request);
    expect(response.statusCode).to.equal(200);
  });
});
