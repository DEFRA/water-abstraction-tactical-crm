'use strict'

const Boom = require('@hapi/boom')

const { logger } = require('../../../logger')
const roleService = require('../../services/roles')

const getRoleByName = async request => {
  try {
    const { roleName } = request.params
    const role = await roleService.getRoleByName(roleName)

    if (!role) {
      return Boom.notFound(`No role found with name: ${roleName}`)
    }
    return role
  } catch (err) {
    logger.error('Error getting role', err)
    return Boom.boomify(err)
  }
}

exports.getRoleByName = getRoleByName
