'use strict'

const fs = require('fs')
const path = require('path')
let Promise

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function (options, _seedLink) {
  Promise = options.Promise
}

exports.up = function (db) {
  const filePath = path.join(__dirname, 'sqls', '20180202150305-optimise-query-up.sql')
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
  const filePath = path.join(__dirname, 'sqls', '20180202150305-optimise-query-down.sql')
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
