const MomentRange = require('moment-range')
const moment = MomentRange.extendMoment(require('moment'))

/**
 * Returns a moment range for the startDate and endDate
 * in the given object
 *
 * @param {Object} obj containing startDate and endDate
 * @return {MomentRange}
 */
const getDateRange = obj => {
  const start = moment(obj.startDate, 'YYYY-MM-DD')
  const end = obj.endDate ? moment(obj.endDate, 'YYYY-MM-DD') : null
  return moment.range(start, end)
}

/**
 * Checks whether or not the date range in the existing entity
 * overlaps the date ranges of any of the existing entities
 *
 * @param {Object} incomingEntity to validate date range
 * @param {Array<Object>} existingEntities to compare dates against
 * @return {Boolean}
 */
const hasOverlap = (incomingEntity, existingEntities) => {
  const incomingDateRange = getDateRange(incomingEntity)

  return existingEntities
    .map(entity => getDateRange(entity))
    .some(range => range.overlaps(incomingDateRange))
}

exports.getDateRange = getDateRange
exports.hasOverlap = hasOverlap
