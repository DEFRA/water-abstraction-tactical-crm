const { beforeEach, afterEach, experiment, test } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const sandbox = require('sinon').createSandbox();
const controller = require('../../src/controllers/unlink-licence');
const repos = require('../../src/lib/repos');
const Boom = require('@hapi/boom');

const request = {
  params: {
    documentId: 'doc-id'
  }
};

const h = {};

experiment('controllers/unlink-licence', async () => {
  afterEach(async () => { sandbox.restore(); });

  experiment('.patchUnlinkLicence', async () => {
    const documentData = {
      document_id: request.params.documentId,
      system_external_id: '123/abc'
    };
    beforeEach(() => {
      sandbox.stub(repos.docHeadersRepo, 'unlinkLicence');
    });

    test('happy path - returns the document object', async () => {
      repos.docHeadersRepo.unlinkLicence.resolves(documentData);
      const document = await controller.patchUnlinkLicence(request, h);
      expect(document).to.equal(documentData);
    });

    test('unhappy path - Boom error is thrown', async () => {
      repos.docHeadersRepo.unlinkLicence.throws(Boom.notFound(`Document does not exist`));
      const result = await controller.patchUnlinkLicence(request, h);
      expect(result).to.be.an.error();
      expect(result.isBoom).to.be.true();
    });

    test('unhappy path - other error is thrown', async () => {
      repos.docHeadersRepo.unlinkLicence.throws(Error('unexpected error'));
      try {
        await controller.patchUnlinkLicence(request, h);
      } catch (err) {
        expect(err.isBoom).to.be.undefined();
        expect(err.message).to.equal('unexpected error');
      }
    });
  });
});
