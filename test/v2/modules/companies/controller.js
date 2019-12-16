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
    sandbox.stub(repositories.companies, 'findByInvoiceAccountIds').resolves([]);
  });

  afterEach(async () => {
    sandbox.restore();
  });

  experiment('.getCompanies', () => {
    test('passes the query ids to the repository as an array', async () => {
      const request = {
        query: {
          invoiceAccountIds: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
        }
      };

      await controller.getCompanies(request);
      const [invoiceAccountIds] = repositories.companies.findByInvoiceAccountIds.lastCall.args;
      expect(invoiceAccountIds).to.equal([
        '00000000-0000-0000-0000-000000000000',
        '11111111-0000-0000-0000-000000000000'
      ]);
    });

    experiment('when no companies are found', () => {
      test('an empty array is returned', async () => {
        repositories.companies.findByInvoiceAccountIds.resolves([]);

        const request = {
          query: {
            invoiceAccountIds: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
          }
        };

        const response = await controller.getCompanies(request);

        expect(response).to.equal([]);
      });
    });

    experiment('when companies are found', () => {
      test('the objects have their keys camel cased', async () => {
        repositories.companies.findByInvoiceAccountIds.resolves([
          { company_id: '00000000-0000-0000-0000-000000000000' },
          { company_id: '00000000-0000-0000-0000-000000000001' }
        ]);

        const request = {
          query: {
            invoiceAccountIds: '00000000-0000-0000-0000-000000000000,11111111-0000-0000-0000-000000000000'
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
