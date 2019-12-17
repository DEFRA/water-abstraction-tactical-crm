const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

const controller = require('../../../../src/v2/modules/companies/controller');
const repositories = require('../../../../src/v2/connectors/repository');

experiment('v2/modules/companies/controller', () => {
  beforeEach(async () => {
    sandbox.stub(repositories.companies, 'findByInvoiceAccountNumbers').resolves([]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getCompanies', () => {
    test('passes the query ids to the repository as an array', async () => {
      const request = {
        query: {
          invoiceAccountNumber: [
            'A00000000A',
            'A11111111A'
          ]
        }
      };

      await controller.getCompanies(request);
      const [invoiceAccountNumbers] = repositories.companies.findByInvoiceAccountNumbers.lastCall.args;
      expect(invoiceAccountNumbers).to.equal([
        'A00000000A',
        'A11111111A'
      ]);
    });

    experiment('when no companies are found', () => {
      test('an empty array is returned', async () => {
        repositories.companies.findByInvoiceAccountNumbers.resolves([]);

        const request = {
          query: {
            invoiceAccountNumber: [
              'A00000000A',
              'A11111111A'
            ]
          }
        };

        const response = await controller.getCompanies(request);

        expect(response).to.equal([]);
      });
    });

    experiment('when companies are found', () => {
      test('the objects have their keys camel cased', async () => {
        repositories.companies.findByInvoiceAccountNumbers.resolves([
          { company_id: '00000000-0000-0000-0000-000000000000' },
          { company_id: '00000000-0000-0000-0000-000000000001' }
        ]);

        const request = {
          query: {
            invoiceAccountNumber: [
              'A00000000A',
              'A11111111A'
            ]
          }
        };

        const response = await controller.getCompanies(request);

        expect(response).to.equal([
          { companyId: '00000000-0000-0000-0000-000000000000' },
          { companyId: '00000000-0000-0000-0000-000000000001' }
        ]);
      });
    });
  });
});
