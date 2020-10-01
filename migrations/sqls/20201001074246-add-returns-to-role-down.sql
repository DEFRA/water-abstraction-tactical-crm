/* delete document roles using the returnsTo role */
delete from crm_v2.document_roles dr
  using crm_v2.roles r
  where dr.role_id=r.role_id and r.name='returnsTo';

/* delete the returnsTo role */
delete from crm_v2.roles
  where name='returnsTo';