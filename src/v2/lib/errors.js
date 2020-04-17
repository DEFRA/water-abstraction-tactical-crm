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

exports.UniqueConstraintViolation = UniqueConstraintViolation;
