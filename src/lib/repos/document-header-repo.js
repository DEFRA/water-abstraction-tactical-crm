const Repository = require('@envage/hapi-pg-rest-api/src/repository');
const Boom = require('@hapi/boom');

/**
 * Repository for crm.document_header table
 * @extends Repository
 */
class DocumentHeadersRepository extends Repository {
  /**
   * Unlinks the licence by setting the company_entity_id and verification_id fields to null
   * @param  {Number} userId    - the user ID
   * @param  {String} resetGuid - a new reset GUID
   * @return {Promise}            resolves when reset GUID is updated
   */
  async unlinkLicence (documentId) {
    const filter = { document_id: documentId };
    const data = { company_entity_id: null, verification_id: null };
    const { rows: [document] } = await this.update(filter, data);

    if (!document) {
      throw Boom.notFound(`Document ${documentId} does not exist`);
    }
    return document;
  }
};

exports.DocumentHeadersRepository = DocumentHeadersRepository;
