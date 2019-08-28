const { beforeEach, afterEach, experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const Repository = require('@envage/hapi-pg-rest-api/src/repository');
const docHeadersRepo = require('../../../src/lib/repos').docHeadersRepo;

const documentId = 'doc-id';

const response = {
  rows: [{
    document_id: 'doc-id',
    system_external_id: '123/abc'
  }]
};

experiment('lib/repos/document-header-repo', async () => {
  beforeEach(() => {
    sandbox.stub(Repository.prototype, 'update').resolves(response);
  });

  afterEach(async () => { sandbox.restore(); });

  experiment('.unlinkLicence', async () => {
    test('.update is called with the correct parameters', async () => {
      await docHeadersRepo.unlinkLicence(documentId);
      const filter = { document_id: documentId };
      const data = { company_entity_id: null, verification_id: null, document_name: null };
      expect(
        Repository.prototype.update.calledWith(filter, data)
      ).to.be.true();
    });

    test('returns document data if it exists', async () => {
      const document = await docHeadersRepo.unlinkLicence(documentId);
      expect(document).to.equal(response.rows[0]);
    });

    test('returns Boom error if document does not exist', async () => {
      Repository.prototype.update.resolves({ rows: [] });
      try {
        await docHeadersRepo.unlinkLicence(documentId);
      } catch (err) {
        expect(err.isBoom).to.be.true();
        expect(err.output.statusCode).to.equal(404);
      }
    });
  });
});
