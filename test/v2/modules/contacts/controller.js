const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const controller = require('../../../../src/v2/modules/contacts/controller');
const contactService = require('../../../../src/v2/services/contacts');

experiment('v2/modules/contacts/controller', () => {
  beforeEach(async () => {
    sandbox.stub(contactService, 'getContactsByIds').resolves([]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getContacts', () => {
    test('passes the query ids to the repository as an array', async () => {
      const request = {
        query: {
          ids: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
        }
      };

      await controller.getContacts(request);
      const [ids] = contactService.getContactsByIds.lastCall.args;
      expect(ids).to.equal([
        '00000000-0000-0000-0000-000000000000',
        '11111111-0000-0000-0000-000000000000'
      ]);
    });

    experiment('when no contacts are found', () => {
      test('an empty array is returned', async () => {
        contactService.getContactsByIds.resolves([]);

        const request = {
          query: {
            ids: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
          }
        };

        const response = await controller.getContacts(request);

        expect(response).to.equal([]);
      });
    });

    experiment('when a contacts are found', () => {
      test('the data is returned', async () => {
        const contacts = [
          { contactId: '00000000-0000-0000-0000-000000000000' },
          { contactId: '00000000-0000-0000-0000-000000000001' }
        ];

        contactService.getContactsByIds.resolves(contacts);

        const request = {
          query: {
            ids: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
          }
        };

        const response = await controller.getContacts(request);

        expect(response).to.equal(contacts);
      });
    });
  });
});
