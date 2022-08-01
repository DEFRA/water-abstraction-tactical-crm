const errors = require('../../lib/errors')

const handleRepoError = (err) => {
  if (parseInt(err.code) === 23505) {
    throw new errors.UniqueConstraintViolation(err.detail)
  } else if (parseInt(err.code) === 23503) {
    throw new errors.ForeignKeyConstraintViolation(err.detail)
  }
  throw err
}

module.exports = handleRepoError
