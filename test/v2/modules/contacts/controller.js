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
const repositories = require('../../../../src/v2/connectors/repository');

experiment('v2/modules/contacts/controller', () => {
  beforeEach(async () => {
    sandbox.stub(repositories.contacts, 'findOneById').resolves();
    sandbox.stub(repositories.contacts, 'findManyById').resolves([]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getContact', () => {
    experiment('when there is no contact found', () => {
      test('a 404 response is returned', async () => {
        repositories.contacts.findOneById.resolves(null);

        const contactId = '00000000-0000-0000-0000-000000000000';
        const request = { params: { contactId } };
        const response = await controller.getContact(request);

        expect(response.output.payload.message).to.equal(`No contact for ${contactId}`);
        expect(response.output.payload.statusCode).to.equal(404);
      });
    });

    experiment('when a contact is found', () => {
      test('the object has its keys camel cased', async () => {
        const contactId = '00000000-0000-0000-0000-000000000000';

        repositories.contacts.findOneById.resolves({
          contact_id: contactId
        });

        const request = { params: { contactId } };
        const response = await controller.getContact(request);

        expect(response).to.equal({ contactId });
      });
    });
  });

  experiment('.getContacts', () => {
    test('passes the query ids to the repository as an array', async () => {
      const request = {
        query: {
          id: [
            '00000000-0000-0000-0000-000000000000',
            '11111111-0000-0000-0000-000000000000'
          ]
        }
      };

      await controller.getContacts(request);
      const [ids] = repositories.contacts.findManyById.lastCall.args;
      expect(ids).to.equal([
        '00000000-0000-0000-0000-000000000000',
        '11111111-0000-0000-0000-000000000000'
      ]);
    });

    experiment('when no contacts are found', () => {
      test('an empty array is returned', async () => {
        repositories.contacts.findManyById.resolves([]);

        const request = {
          query: {
            id: [
              '00000000-0000-0000-0000-000000000000',
              '11111111-0000-0000-0000-000000000000'
            ]
          }
        };

        const response = await controller.getContacts(request);

        expect(response).to.equal([]);
      });
    });

    experiment('when a contacts are found', () => {
      test('the objects have their keys camel cased', async () => {
        repositories.contacts.findManyById.resolves([
          { contact_id: '00000000-0000-0000-0000-000000000000' },
          { contact_id: '00000000-0000-0000-0000-000000000001' }
        ]);

        const request = {
          query: {
            id: [
              '00000000-0000-0000-0000-000000000000',
              '11111111-0000-0000-0000-000000000000'
            ]
          }
        };

        const response = await controller.getContacts(request);

        expect(response).to.equal([
          { contactId: '00000000-0000-0000-0000-000000000000' },
          { contactId: '00000000-0000-0000-0000-000000000001' }
        ]);
      });
    });
  });
});
