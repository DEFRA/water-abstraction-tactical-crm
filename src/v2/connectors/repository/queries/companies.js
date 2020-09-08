
exports.findByCompanyNameWithSoftSearch = `
select companies.company_id, companies.name, companies.type from crm_v2.companies companies
where (:soft IS FALSE AND UPPER(name)=UPPER(:name)) OR (:soft IS TRUE AND UPPER(name) LIKE '%' || UPPER(:name) || '%')
order by name ASC
`;
