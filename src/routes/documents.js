const { version } = require('../../config');
const Joi = require('joi');

const documentsController = require('../controllers/documents');

const basePath = `/crm/${version}/documents`;

module.exports = {
  '/crm/{documentId}/users': {
    method: 'GET',
    path: `${basePath}/{documentId}/users`,
    handler: documentsController.getDocumentUsers,
    options: {
      description: 'Get all the users associated with a document via the company',
      validate: {
        params: Joi.object().keys({
          documentId: Joi.string().guid()
        })
      }
    }
  }
};
