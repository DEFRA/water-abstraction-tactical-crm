-- Remove all previously imported document roles
-- These will be re-imported
delete from crm_v2.document_roles;

-- Remove all except 1 document per licence
delete from crm_v2.documents 
  where document_id not in (

     -- Get first document version for each licence number
     select distinct on (d.document_ref) d.document_id
       from crm_v2.documents d
       order by d.document_ref, d.version_number  
  );

-- Remove unwanted columns
alter table crm_v2.documents  
  drop column version_number,
  drop column status;

-- Drop unwanted enum type
drop type "crm_v2"."document_status";
