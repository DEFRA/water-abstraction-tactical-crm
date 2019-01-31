const Boom = require('boom');
const { pool } = require('../lib/connectors/db');
const logger = require('../lib/logger');

const getDocumentUsersQuery = `
  select e.entity_id, er.role, e.entity_nm
  from crm.document_header dh
    inner join crm.entity_roles er on dh.company_entity_id = er.company_entity_id
    inner join crm.entity e on er.entity_id = e.entity_id
  where dh.document_id = $1
  and e.entity_type = 'individual';
`;

const getDocumentUsers = async (request, h) => {
  try {
    const result = await pool.query(getDocumentUsersQuery, [request.params.documentId]);

    if (result.rows.length) {
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
    }
    return Boom.notFound();
  } catch (error) {
    const msg = 'Error getting document users';
    logger.error(msg, error);
    return Boom.badImplementation(msg, error);
  }
};

module.exports = {
  getDocumentUsers
};
