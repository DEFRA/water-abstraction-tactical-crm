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
  const { documentId } = request.params;
  const params = [documentId];

  try {
    const result = await pool.query(getDocumentUsersQuery, params);

    if (result.rows.length) {
      const data = result.rows.map(entity => ({
        entityId: entity.entity_id,
        role: entity.role,
        entityName: entity.entity_nm
      }));

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
