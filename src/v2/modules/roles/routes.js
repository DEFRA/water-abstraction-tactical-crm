'use strict'

const Joi = require('joi')
const controller = require('./controller')

exports.getRoleByName = {
  method: 'GET',
  path: '/crm/2.0/roles/{roleName}',
  handler: controller.getRoleByName,
  options: {
    description: 'Get a role by name',
    validate: {
      params: Joi.object().keys({
        roleName: Joi.string().required()
      })
    }
  }
}
