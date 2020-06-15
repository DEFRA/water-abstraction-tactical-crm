'use-strict';
const { pool } = require('../connectors/db');

/**
 * returns the number of delegated access granted by month for the current year including the % change by month
 * with the totals for the year to date and overall total
 */
const getEntityRolesKPIdata = async () => {
  const query = `SELECT date_part('month', created_at)::integer AS month,
    date_part('year', created_at)::integer as year,
    COUNT(entity_id)::integer AS total,
    date_part('year', created_at) = date_part('year', CURRENT_DATE) AS current_year
    FROM
       (SELECT distinct entity_id, created_at FROM crm.entity_roles where role <> 'primary_user') AS tbl
       GROUP BY month, current_year, year;`;

  const { rows: data, error } = await pool.query(query);
  return { data, error };
};

module.exports.getEntityRolesKPIdata = getEntityRolesKPIdata;
