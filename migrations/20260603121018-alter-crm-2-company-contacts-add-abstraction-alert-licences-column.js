'use strict'

const fs = require('fs')
const path = require('path')
let Promise

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  Promise = options.Promise
}

exports.up = function (db) {
  const filePath = path.join(__dirname, 'sqls', '20260603121018-alter-crm-2-company-contacts-add-abstraction-alert-licences-column-up.sql')
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
      if (err) return reject(err)

      resolve(data)
    })
  })
    .then(function (data) {
      return db.runSql(data)
    })
}

exports.down = function (db) {
  const filePath = path.join(__dirname, 'sqls', '20260603121018-alter-crm-2-company-contacts-add-abstraction-alert-licences-column-down.sql')
  return new Promise(function (resolve, reject) {
    fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
      if (err) return reject(err)

      resolve(data)
    })
  })
    .then(function (data) {
      return db.runSql(data)
    })
}

exports._meta = {
  version: 1
}
