'use strict';

const rolesRepo = require('../connectors/repository/roles');

const getRoleByName = roleName => rolesRepo.findOneByName(roleName);

exports.getRoleByName = getRoleByName;
