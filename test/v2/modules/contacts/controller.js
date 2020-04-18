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
  let h;
  const hapiResponse = {
    code: sandbox.spy(),
    created: sandbox.spy()
  };

  beforeEach(async () => {
    h = {
      response: sandbox.stub().returns(hapiResponse)
    };

    sandbox.stub(contactService, 'getContact').resolves();
    sandbox.stub(contactService, 'getContactsByIds').resolves([]);
    sandbox.stub(contactService, 'createContact').resolves();
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getContact', () => {
    experiment('when there is no contact found', () => {
      test('a 404 response is returned', async () => {
        contactService.getContact.resolves(null);

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

        contactService.getContact.resolves({ contactId });

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

  experiment('.postContact', () => {
    experiment('for an invalid contact', () => {
      let response;

      beforeEach(async () => {
        const request = {
          payload: {
            salutation: 'Mr',
            lastName: 'Invalid'
          }
        };

        contactService.createContact.restore();
        response = await controller.postContact(request, h);
      });

      test('a 422 response is sent because the data is invalid', async () => {
        expect(response.output.payload.statusCode).to.equal(422);
      });

      test('the response contains the validation error details', async () => {
        expect(response.output.payload.message).to.equal('Contact not valid');
        expect(response.output.payload.validationDetails).to.be.an.array();
        expect(response.output.payload.validationDetails[0]).to.be.a.string();
      });
    });

    experiment('for a valid contact', () => {
      beforeEach(async () => {
        const request = {
          payload: {
            firstName: 'Val',
            lastName: 'Id'
          }
        };

        contactService.createContact.resolves({
          contactId: 'test-contact-id'
        });

        await controller.postContact(request, h);
      });

      test('the response contains the new contact', async () => {
        const [body] = h.response.lastCall.args;
        expect(body.contactId).to.equal('test-contact-id');
      });

      test('returns a 201 response code', async () => {
        const [url] = hapiResponse.created.lastCall.args;
        expect(url).to.equal('/crm/2.0/contacts/test-contact-id');
      });
    });
  });
});
