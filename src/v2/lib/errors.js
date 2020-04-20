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

class ForeignKeyConstraintViolation extends DBError {
  constructor (message) {
    super(message);
    this.name = 'ForeignKeyConstraintViolation';
  }
}

exports.UniqueConstraintViolation = UniqueConstraintViolation;
exports.ForeignKeyConstraintViolation = ForeignKeyConstraintViolation;
