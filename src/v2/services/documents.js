'use strict';

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
const { omit } = require('lodash');

const documentValidator = require('../modules/documents/validator');
const documentRoleRepo = require('../connectors/repository/document-roles');
const rolesRepo = require('../connectors/repository/roles');
const errors = require('../lib/errors');

/**
 * Create a moment date range
 *
 * @param {String} startDate A start date in the format YYYY-MM-DD
 * @param {String|null} endDate A end date in the format YYYY-MM-DD or null
 */
const getDateRange = (startDate, endDate) => {
  const start = moment(startDate, 'YYYY-MM-DD');
  const end = endDate === null ? null : moment(endDate, 'YYYY-MM-DD');
  return moment.range(start, end);
};

/**
 * Creates a date range using the start and end dates from a docment role
 *
 * @param {Object} documentRole A document role
 */
const getDocumentRoleDateRange = documentRole =>
  getDateRange(documentRole.startDate, documentRole.endDate);

/**
   * Checks that the proposed document role object does not have a date range
   * that conflicts with the date create for any existing document roles
   * that represent the same role type and document.
   *
   * Throws an error if there is a clash
   *
   * @param {Object} documentRole The incoming request data for a proposed document role record
   */
const ensureDateRangeDoesNotOverlapWithExistingRoles = async documentRole => {
  const { role, documentId, startDate, endDate } = documentRole;
  const incomingDateRange = getDateRange(startDate, endDate);

  // get the existing document roles for the document and role
  const allDocumentRoles = await documentRoleRepo.findByDocumentId(documentId);

  // ensure there is no overlap on the dates
  const hasOverlap = allDocumentRoles
    .filter(dr => dr.role.name === role)
    .map(getDocumentRoleDateRange)
    .some(range => range.overlaps(incomingDateRange));

  if (hasOverlap) {
    throw new errors.ConflictingDataError('Existing document role exists for date range');
  }
};

/**
 * Replaces the role name with the role id in the data ready for
 * persisting to the data store.
 *
 * @param {Object} documentRole The incoming request data for a proposed document role record
 */
const replaceRoleNameWithRoleId = async documentRole => {
  const roleEntity = await rolesRepo.findOneByName(documentRole.role);

  return {
    roleId: roleEntity.roleId,
    ...omit(documentRole, 'role')
  };
};

/**
 *
 * Attempts to create a new document role entry. Will only save if:
 *
 * The data is valid
 * The date range does not overlap with another entry for the
 * role type and document id
 *
 * @param {Object} documentRole The document role data to persist
 */
const createDocumentRole = async documentRole => {
  const { error, value: validatedDocumentRole } = documentValidator.validateDocumentRole(documentRole);

  if (error) {
    const details = error.details.map(detail => detail.message);
    throw new errors.EntityValidationError('Document Role not valid', details);
  }

  await ensureDateRangeDoesNotOverlapWithExistingRoles(validatedDocumentRole);

  const documentRoleToSave = await replaceRoleNameWithRoleId(validatedDocumentRole);

  return documentRoleRepo.create(documentRoleToSave);
};

const getDocumentRole = documentRoleId => documentRoleRepo.findOne(documentRoleId);

exports.createDocumentRole = createDocumentRole;
exports.getDocumentRole = getDocumentRole;
