class DBError extends Error {
  constructor (message) {
    super(message);
    this.name = 'DBError';
  }
}

class UniqueConstraintViolation extends DBError {
  constructor (message) {
    super(message);
    this.name = 'UniqueConstraintViolation';
  }
}

class UniqueForeignKeyConstraintViolation extends DBError {
  constructor (message) {
    super(message);
    this.name = 'UniqueForeignKeyConstraintViolation';
  }
}

exports.UniqueConstraintViolation = UniqueConstraintViolation;
exports.UniqueForeignKeyConstraintViolation = UniqueForeignKeyConstraintViolation;
