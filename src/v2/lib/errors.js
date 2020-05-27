'use strict';

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

class EntityValidationError extends Error {
  /**
   * Creates a new EntityValidationError representing the failed validation
   * of an entity that is moving through the service layer on it's way
   * to being perstisted in the database
   *
   * @param {String} message The validation failure message
   * @param {Array<String>} validationDetails A list of validation failure details
   */
  constructor (message, validationDetails) {
    super(message);
    this.name = 'EntityValidationError';
    this.validationDetails = validationDetails;
  }
}

class ConflictingDataError extends Error {
  constructor (message) {
    super(message);
    this.name = 'ConflictingDataError';
  }
}

exports.ConflictingDataError = ConflictingDataError;
exports.EntityValidationError = EntityValidationError;
exports.ForeignKeyConstraintViolation = ForeignKeyConstraintViolation;
exports.UniqueConstraintViolation = UniqueConstraintViolation;
