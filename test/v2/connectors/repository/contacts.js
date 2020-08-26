'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const contactsRepo = require('../../../../src/v2/connectors/repository/contacts');
const Contact = require('../../../../src/v2/connectors/bookshelf/Contact');
const repoHelpers = require('../../../../src/v2/connectors/repository/helpers');

experiment('v2/connectors/repository/contacts', () => {
  let stub, model;

  beforeEach(async () => {
    model = [{
      contactId: 'test-model-contact-id'
    }];

    stub = {
      where: sandbox.stub().returnsThis(),
      fetchAll: sandbox.stub().resolves(model)
    };

    sandbox.stub(Contact, 'forge').returns(stub);
    sandbox.stub(repoHelpers, 'findOne');
    sandbox.stub(repoHelpers, 'create');
    sandbox.stub(repoHelpers, 'deleteTestData');
    sandbox.stub(repoHelpers, 'deleteOne');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.findOne', () => {
    test('is created using the helpers', async () => {
      await contactsRepo.findOne('test-id');

      const [model, field, id] = repoHelpers.findOne.lastCall.args;
      expect(model).to.equal(Contact);
      expect(field).to.equal('contactId');
      expect(id).to.equal('test-id');
    });
  });

  experiment('.create', () => {
    test('is created using the helpers', async () => {
      const contact = { contactId: 'test-id' };
      await contactsRepo.create(contact);

      const [model, contactData] = repoHelpers.create.lastCall.args;
      expect(model).to.equal(Contact);
      expect(contactData).to.equal(contact);
    });
  });

  experiment('.findManyByIds', () => {
    let result;
    let contactIds;

    beforeEach(async () => {
      contactIds = ['id-one', 'id-two'];
      result = await contactsRepo.findManyByIds(contactIds);
    });

    test('forges a Contact model', async () => {
      expect(Contact.forge.called).to.equal(true);
    });

    test('seaches for all contact ids in the passed array', async () => {
      const [field, filter, ids] = stub.where.lastCall.args;
      expect(field).to.equal('contact_id');
      expect(filter).to.equal('in');
      expect(ids).to.equal(contactIds);
    });

    test('returns the data from fetchAll', async () => {
      expect(result).to.equal(model);
    });
  });

  experiment('.deleteOne', () => {
    test('uses the repository helpers deleteOne function', async () => {
      await contactsRepo.deleteOne('test-contact-id');

      const [model, idKey, id] = repoHelpers.deleteOne.lastCall.args;
      expect(model).to.equal(Contact);
      expect(idKey).to.equal('contactId');
      expect(id).to.equal('test-contact-id');
    });
  });

  experiment('.deleteTestData', () => {
    test('is created using the helpers', async () => {
      await contactsRepo.deleteTestData();

      const [model] = repoHelpers.deleteTestData.lastCall.args;
      expect(model).to.equal(Contact);
    });
  });

  experiment('.findOneWithCompanies', () => {
    test('is created using the helpers', async () => {
      await contactsRepo.findOneWithCompanies('test-id');

      const [model, field, id, related] = repoHelpers.findOne.lastCall.args;
      expect(model).to.equal(Contact);
      expect(field).to.equal('contactId');
      expect(id).to.equal('test-id');
      expect(related).to.equal(['companyContacts']);
    });
  });
});
