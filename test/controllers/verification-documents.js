const { expect } = require('code');
const { beforeEach, afterEach, experiment, test } = exports.lab = require('lab').script();
const helpers = require('../helpers');

const controller = require('../../src/controllers/verification-documents');

experiment('getUserVerifications', () => {
  let regimeEntity;
  let companyEntity;
  let userEntity;
  let documentOneHeader;
  let documentTwoHeader;
  let verification;
  let response;

  beforeEach(async () => {
    regimeEntity = await helpers.createEntity('regime');
    companyEntity = await helpers.createEntity('company');
    userEntity = await helpers.createEntity('user');
    documentOneHeader = await helpers.createDocumentHeader(regimeEntity.entity_id);
    documentTwoHeader = await helpers.createDocumentHeader(regimeEntity.entity_id);
    verification = await helpers.createVerification(userEntity.entity_id, companyEntity.entity_id);
    await helpers.createVerificationDocument(verification.verification_id, documentOneHeader.document_id);
    await helpers.createVerificationDocument(verification.verification_id, documentTwoHeader.document_id);

    response = await controller.getUserVerifications({ params: { entity_id: userEntity.entity_id } });
  });

  afterEach(async () => {
    await helpers.deleteVerificationDocument(verification.verification_id);
    await helpers.deleteVerification(verification.verification_id);
    await helpers.deleteDocumentHeader(documentOneHeader.document_id);
    await helpers.deleteDocumentHeader(documentTwoHeader.document_id);
    await helpers.deleteEntity(userEntity.entity_id);
    await helpers.deleteEntity(companyEntity.entity_id);
    await helpers.deleteEntity(regimeEntity.entity_id);
  });

  test('returns an empty array when there are no verifications for the user', async () => {
    const request = { params: { entity_id: '00000000-0000-0000-0000-000000000000' } };
    const response = await controller.getUserVerifications(request);
    expect(response.data).to.equal([]);
  });

  test('response shape', async () => {
    expect(response.data.length).to.equal(1);

    const returnedVerification = response.data[0];

    expect(returnedVerification.id).to.equal(verification.verification_id);
    expect(returnedVerification.companyEntityId).to.equal(companyEntity.entity_id);
    expect(returnedVerification.code).to.equal(verification.verification_code);

    expect(returnedVerification.documents.length).to.equal(2);
    expect(returnedVerification.documents.find(d => d.documentId === documentOneHeader.document_id)).to.exist();
    expect(returnedVerification.documents.find(d => d.documentId === documentTwoHeader.document_id)).to.exist();
  });
});
