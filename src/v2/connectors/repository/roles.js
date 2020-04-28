'use strict';

const Role = require('../bookshelf/Role');

/**
 * Find single Role by name
 * @param {String} name
 * @return {Promise<Object>}
 */
const findOneByName = async name => {
  const role = await Role.forge().where({ name }).fetch({ require: false });
  return role && role.toJSON();
};

exports.findOneByName = findOneByName;
