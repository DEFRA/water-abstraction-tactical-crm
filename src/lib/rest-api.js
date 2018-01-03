/**
 * A module to create a HAPI REST API connected to a PostGreSQL table
 * to reduce boilerplate code
 * @module lib/rest-api
 */
const moment = require('moment');
const forEach = require('lodash/forEach');
const map = require('lodash/map');
const Db = require('./connectors/db');
const {SqlConditionBuilder, SqlSortBuilder} = require('./sql');
const Helpers = require('./helpers');




/**
 * @param {Object} config - configuration options
 * @param {String} config.endpoint - base endpoint, e.g. /crm/1.0/entities
 * @param {String} config.table - DB table name
 * @param {String} config.primaryKey - primary key field name
 * @param {Function} config.preInsert - function for modifying data pre-insert
 * @param {Function} config.onCreateTimestamp - field to update with NOW() on create
 */
function HAPIRestAPI(config) {

  // Require validation
  if(!config.validation) {
    throw `Validation missing from API config`;
  }

  this.config = Object.assign({
    // Modify data pre-insert
    preInsert : (data) => data
  }, config);

  /**
   * Get an error handler function
   * @param {Object} res - PostGres DB response
   * @return {function} DB error handler - sends 400 reply with status code
   */
  this.errorHandler = (res, reply) => {
    const {stack, code} = res.error;
    console.error(res.error);
    return reply({ error : {code, stack}, data : null }).code(400);
  }


  /**
   * Find a single record in DB by primary key
   * @param {Mixed} request.params.id - the primary key value to search
   */
  this.findOne = (request, reply) => {
    const {table, primaryKey} = this.config;
    const query = `SELECT * FROM ${ table } WHERE ${ primaryKey }=$1`;
    const queryParams = [request.params.id];
    console.log(query,queryParams);
    Db.query(query, queryParams)
      .then((res) => {
        if(res.data.length) {
          reply({error : null, data : res.data[0]});
        }
        else {
          reply({error : {message : 'NotFoundError'}}).code(404);
        }
      })
      .catch((err) => {
        reply({error : err, data : null});
      });
  }

  /**
   * Find many results
   * @param {Object} request.query
   * @param {String} request.query.filter - JSON encoded filter
   */
  this.findMany = (request, reply) => {

    const filter = 'filter' in request.query ? JSON.parse(request.query.filter) : {};
    const sort = 'sort' in request.query ? JSON.parse(request.query.sort) : {};

    // @TODO limit/paginate
    const {table, primaryKey} = this.config;
    const conditions = new SqlConditionBuilder();

    // Filtering
    forEach(filter, (value, key) => {
      conditions.and(key, value);
    });

    let query = `SELECT * FROM ${ table } WHERE 0=0 ` + conditions.getSql();
    let queryParams = conditions.getParams();

    // Sorting
    const sortBuilder = new SqlSortBuilder();
    query += sortBuilder.add(sort).getSql();

    console.log(query,queryParams);

    Db.query(query, queryParams)
      .then((res) => {
        reply(res);
      })
      .catch((error) => {
        reply({error, data : null});
      });

  }

  /**
   * Create a new record (POST)
   * @param {Object} request.payload - the data to insert
   */
  this.create = (request, reply) => {
    const {table, primaryKey} = this.config;

    const data = this.config.preInsert(request.payload);
    data[primaryKey] = Helpers.createGUID();

    // On create timestamp
    if(this.config.onCreateTimestamp) {
      data[this.config.onCreateTimestamp] = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    const fields = Object.keys(data);
    const queryParams = Object.values(data);
    const values = fields.map((value, i) => '$' + (i+1));

    const query = `INSERT INTO ${ table } (${fields.join(',')}) VALUES (${values.join(',')})`;

    Db.query(query, queryParams)
      .then((res) => {
        if(res.error) {
          return this.errorHandler(res, reply);
        }
        else {
          reply({error : null, data}).code(201);
        }
      })
      .catch((error) => {
        reply({error, data : null});
      });
  }

  /**
   * Update a record (PATCH)
   * @param {String} request.params.id
   * @param {Object} request.payload - field/value pairs to update
   */
  this.update = (request, reply) => {
    const {table, primaryKey} = this.config;

    const queryParams = [];
    const set = map(request.payload, (value, key) => {
      queryParams.push(value);
      return `${ key }=$${queryParams.length}`;
    });

    queryParams.push(request.params.id);
    const query = `UPDATE ${ table } SET ${ set.join(',') } WHERE ${ primaryKey }=$${ queryParams.length }`;

    Db.query(query, queryParams)
      .then((res) => {
        if(res.error) {
          return this.errorHandler(res, reply);
        }
        else {
          reply({error : null, data : []});
        }
      })
      .catch((error) => {
        reply({error, data : null});
      });

  }

  /**
   * Replace a whole record (PUT)
   * @TODO
   */
  this.replace = (request, reply)  => {
    reply({error : 'Not implemented'}).code(501);
  }


  /**
   * Delete a record
   * @param {Mixed} request.params.id - the ID of the record to delete
   */
  this.delete = (request, reply) => {
    const {table, primaryKey} = this.config;
    const query = `DELETE FROM ${ table } WHERE ${ primaryKey}=$1`;
    const queryParams = [request.params.id];

    console.log(query,queryParams);

    Db.query(query, queryParams)
      .then((res) => {
        if(res.error) {
          return this.errorHandler(res, reply);
        }
        else {
          reply({error : null, data : null}).code(200);
        }
      })
      .catch((error) => {
        reply({error, data : null});
      });
  }

  /**
   * Get HAPI route config for API
   * @return {Array} - HAPI route config
   */
  this.getRoutes = () => {
    const {endpoint, table, validation, primaryKey} = this.config;

    return [
      { method: 'GET', path : endpoint, handler : this.findMany, config : {
        description : 'Get many ' + table + ' records'
      }},
      { method: 'GET', path : endpoint + '/{id}', handler : this.findOne, config : {
        description : 'Get single ' + table + ' record',
        validate : {
          params : {
            id : validation[primaryKey]
          }
        }
      }},
      { method: 'POST', path : endpoint, handler : this.create, config : {
        description : 'Create new ' + table + ' record',
        validate : {
          payload : validation
        }
      }},
      { method: 'PATCH', path : endpoint + '/{id}', handler : this.update, config : {
        description : 'Patch single ' + table + ' record',
        validate : {
          payload : validation
        }
      }},
      { method : 'PUT', path : endpoint + '/{id}', handler : this.replace, config : {
        description : 'Replace single ' + table + ' record'
      }},
      { method : 'DELETE', path : endpoint + '/{id}', handler : this.delete, config : {
        description : 'Delete single ' + table + 'record'
      }}
    ];
  }
}


module.exports = HAPIRestAPI;
