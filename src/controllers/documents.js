const Boom = require('@hapi/boom');
const { pool } = require('../lib/connectors/db');
const { logger } = require('../logger');
const { repo: documentsRepository } = require('./document-headers');

const getDocumentUsersQuery = `
  select e.entity_id, er.role, e.entity_nm
  from crm.document_header dh
    inner join crm.entity_roles er on dh.company_entity_id = er.company_entity_id
    inner join crm.entity e on er.entity_id = e.entity_id
  where dh.document_id = $1
  and dh.date_deleted is null
  and e.entity_type = 'individual';
`;

const getDocumentUsers = async (request, h) => {
  try {
    // Return 404 if document does not exist
    const { rows: [document] } = await documentsRepository.find({ document_id: request.params.documentId });
    if (!document) {
      return Boom.notFound();
    }

    // Find document users
    const result = await pool.query(getDocumentUsersQuery, [request.params.documentId]);

    const data = result.rows.reduce((acc, entity) => {
      const { entity_id: entityId, role, entity_nm: entityName } = entity;
      const existing = acc.find(e => e.entityId === entityId);

      if (existing) {
        existing.roles.push(role);
        return acc;
      }
      return [...acc, { entityId, roles: [role], entityName }];
    }, []);

    return { data, error: null };
  } catch (error) {
    const msg = 'Error getting document users';
    logger.error(msg, error);
    return Boom.badImplementation(msg, error);
  }
};

exports.getDocumentUsers = getDocumentUsers;
