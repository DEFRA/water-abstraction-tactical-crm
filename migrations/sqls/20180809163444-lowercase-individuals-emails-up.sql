update crm.entity
set entity_nm = lower(entity_nm)
where entity_type = 'individual';
