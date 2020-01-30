const { experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');

const camelCaseKeys = require('../../src/lib/camel-case-keys');

experiment('lib/camelCaseKeys', () => {
  test('converts object keys to camel case', async () => {
    const obj = {
      snake_case: 'foo',
      camelCase: 'bar'
    };

    const result = camelCaseKeys(obj);

    expect(result).to.equal({
      snakeCase: 'foo',
      camelCase: 'bar'
    });
  });
});
