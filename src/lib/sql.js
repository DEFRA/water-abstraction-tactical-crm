/**
 * SQL builder helper classeses
 * @module lib/sql
 */
const isArray = require('lodash/isArray');

/**
 * Provides a way to build a series of AND condition clauses for an SQL query.
 * The field value can be null (mapped to field_name IS NULL)
 * scalar (mapped to field_name=value)
 * or array (mapped to field_name IN value)
 * @class
 */
class SqlConditionBuilder {
  constructor () {
    this.params = [];
    this.sqlFragments = [];
  }

  /**
   * Add an AND condition to query
   * @param {String} field - the field name
   * @param {Mixed} value - the value
   * @return {SqlConditionBuilder} this
   */
  and (field, value) {
    // Null values
    if (value === null) {
      this.sqlFragments.push(` AND ${field} IS NULL `);
    } else if (isArray(value)) {
      // For empty array
      if (value.length === 0) {
        this.sqlFragments.push(' AND 0=1 ');
        return this;
      }
      const bind = Array.from(Array(value.length), (e, i) => '$' + (1 + i + this.params.length));
      this.params.push(...value);
      this.sqlFragments.push(` AND ${field} IN (${bind.join(',')})`);
    } else {
      // Scalar values
      this.params.push(value);
      this.sqlFragments.push(` AND ${field}=$${this.params.length} `);
    }
    return this;
  }

  /**
   * Add an AND condition to query with lowercasing
   * @param {String} field - the field name
   * @param {Mixed} value - the value
   * @return {SqlConditionBuilder} this
   */
  andCaseInsensitive (field, value) {
    // Null values
    if (value === null) {
      this.sqlFragments.push(` AND ${field} IS NULL `);
    } else if (isArray(value)) {
      // Array values
      const bind = Array.from(Array(value.length), (e, i) => '$' + (1 + i + this.params.length));
      this.params.push(...value.map(s => s.toLowerCase()).join(','));
      this.sqlFragments.push(` AND LOWER(${field}) IN (${bind.join(',')})`);
    } else {
      // Scalar values
      this.params.push(value.toLowerCase());
      this.sqlFragments.push(` AND LOWER(${field})=$${this.params.length} `);
    }
    return this;
  }

  /**
   * Get SQL query fragment
   * @return {String} - the SQL query fragment
   */
  getSql () {
    return this.sqlFragments.join(' ');
  }

  /**
   * Get the query params
   * @return {Array}
   */
  getParams () {
    return this.params;
  }

  /**
   * Add param
   * @param {mixed} param - the value to add
   * @return {SqlConditionBuilder} this
   */
  addParam (value) {
    this.params.push(value);
    return this;
  }

  /**
   * Get param count
   * @return {number}
   */
  getParamCount () {
    return this.params.length;
  }
}

module.exports = {
  SqlConditionBuilder
};
