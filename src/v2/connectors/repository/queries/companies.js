
exports.findByCompanyNameWithSoftSearch = `
select company_id, name, type from crm_v2.companies
where (:soft IS FALSE AND UPPER(name)=UPPER(:name)) OR (:soft IS TRUE AND UPPER(name) LIKE '%' || UPPER(:name) || '%')
order by name ASC
`;
