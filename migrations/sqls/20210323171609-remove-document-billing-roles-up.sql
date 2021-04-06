/* Replace with your SQL commands */
delete from 
  crm_v2.document_roles dr
  using crm_v2.roles r 
  where dr.role_id=r.role_id and r.name='billing';
