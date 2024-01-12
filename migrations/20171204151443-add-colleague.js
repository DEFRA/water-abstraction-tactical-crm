const fs = require('fs')
const path = require('path')

exports.up = function (db, callback) {
  const filePath = path.join(__dirname, '/sqls/20171204151443-add-colleague-up.sql')
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (err) return callback(err)

    db.runSql(data, function (err) {
      if (err) return callback(err)
      callback()
    })
  })
}

exports.down = function (db, callback) {
  const filePath = path.join(__dirname, '/sqls/20171204151443-add-colleague-down.sql')
  fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
    if (err) return callback(err)

    db.runSql(data, function (err) {
      if (err) return callback(err)
      callback()
    })
  })
}
