'use strict';

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();

const { v4: uuid } = require('uuid');
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();

const errors = require('../../../src/v2/lib/errors');
const contactsRepo = require('../../../src/v2/connectors/repository/contacts');
const contactsService = require('../../../src/v2/services/contacts');

experiment('services/contacts', () => {
  beforeEach(async () => {
    sandbox.stub(contactsRepo, 'findOne');
    sandbox.stub(contactsRepo, 'findManyByIds');
    sandbox.stub(contactsRepo, 'create');
    sandbox.stub(contactsRepo, 'deleteOne');
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getContact', () => {
    test('returns the result from the repo', async () => {
      const contactId = uuid();
      const contact = { contactId };
      contactsRepo.findOne.resolves(contact);

      const result = await contactsService.getContact(contactId);

      expect(contactsRepo.findOne.calledWith(contactId)).to.equal(true);
      expect(result).to.equal(contact);
    });
  });

  experiment('.getContactsByIds', () => {
    test('returns the results from the repo', async () => {
      const contactIds = [uuid(), uuid()];
      const contacts = [
        { contactId: contactIds[0] },
        { contactId: contactIds[1] }
      ];

      contactsRepo.findManyByIds.resolves(contacts);

      const result = await contactsService.getContactsByIds(contactIds);

      expect(contactsRepo.findManyByIds.calledWith(contactIds)).to.equal(true);
      expect(result).to.equal(contacts);
    });
  });

  experiment('.createContact', () => {
    experiment('when the contact data is invalid', () => {
      let contact;

      beforeEach(async () => {
        contact = {
          type: 'person',
          salutation: 'Mr',
          lastName: 'Invalid'
        };
      });

      test('any EntityValidationError is thrown', async () => {
        const err = await expect(contactsService.createContact(contact))
          .to
          .reject(errors.EntityValidationError, 'Contact not valid');

        expect(err.validationDetails).to.be.an.array();
      });

      test('the contact is not saved', async () => {
        expect(contactsRepo.create.called).to.equal(false);
      });
    });

    experiment('when the contact data is valid', () => {
      let result;
      let contact;

      beforeEach(async () => {
        contact = {
          type: 'person',
          firstName: 'Val',
          lastName: 'Id'
        };

        contactsRepo.create.resolves({
          contactId: 'test-id',
          ...contact
        });

        result = await contactsService.createContact(contact);
      });

      test('the contact "type" is mapped to "contactType"', async () => {
        const [contactData] = contactsRepo.create.lastCall.args;
        expect(contactData.contactType).to.equal(contact.type);
      });

      test('the contact is saved via the repository', async () => {
        expect(contactsRepo.create.called).to.equal(true);
      });

      test('the saved contact is returned', async () => {
        expect(result.contactId).to.equal('test-id');
      });
    });
  });

  experiment('.deleteContact', () => {
    test('calls the deleteOne repo method', async () => {
      await contactsService.deleteContact('test-contact-id');
      expect(contactsRepo.deleteOne.calledWith('test-contact-id')).to.be.true();
    });
  });
});
