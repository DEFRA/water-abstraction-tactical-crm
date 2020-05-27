const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const CompanyContact = require('../../../../src/v2/connectors/bookshelf/CompanyContact');

experiment('v2/connectors/bookshelf/CompanyContact', () => {
  let instance;

  beforeEach(async () => {
    instance = CompanyContact.forge();
    sandbox.stub(instance, 'hasOne');
    sandbox.stub(instance, 'belongsTo');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  test('uses the company_contacts table', async () => {
    expect(instance.tableName).to.equal('company_contacts');
  });

  test('uses the correct ID attribute', async () => {
    expect(instance.idAttribute).to.equal('company_contact_id');
  });

  test('uses the correct timestamp fields', async () => {
    expect(instance.hasTimestamps).to.equal(['date_created', 'date_updated']);
  });

  experiment('the .company() relation', () => {
    beforeEach(async () => {
      instance.company();
    });

    test('is a function', async () => {
      expect(instance.company).to.be.a.function();
    });

    test('calls .belongsTo with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.belongsTo.lastCall.args;
      expect(model).to.equal('Company');
      expect(foreignKey).to.equal('company_id');
      expect(foreignKeyTarget).to.equal('company_id');
    });
  });

  experiment('the .contact() relation', () => {
    beforeEach(async () => {
      instance.contact();
    });

    test('is a function', async () => {
      expect(instance.contact).to.be.a.function();
    });

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args;
      expect(model).to.equal('Contact');
      expect(foreignKey).to.equal('contact_id');
      expect(foreignKeyTarget).to.equal('contact_id');
    });
  });

  experiment('the .roles() relation', () => {
    beforeEach(async () => {
      instance.roles();
    });

    test('is a function', async () => {
      expect(instance.roles).to.be.a.function();
    });

    test('calls .hasOne with correct params', async () => {
      const [model, foreignKey, foreignKeyTarget] = instance.hasOne.lastCall.args;
      expect(model).to.equal('Roles');
      expect(foreignKey).to.equal('role_id');
      expect(foreignKeyTarget).to.equal('role_id');
    });
  });
});
