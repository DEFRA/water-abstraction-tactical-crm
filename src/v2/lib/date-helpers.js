const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(require('moment'));

const getRange = obj => moment.range([
  moment(obj.startDate, 'YYYY-MM-DD'),
  (obj.endDate) ? moment(obj.endDate, 'YYYY-MM-DD') : null
]);

const newEntityOverlapsExistingEntity = (existingEntity, newEntity) => {
  const existingEntityRange = getRange(existingEntity);
  const newEntityRange = getRange(newEntity);
  return existingEntityRange.overlaps(newEntityRange);
};

exports.newEntityOverlapsExistingEntity = newEntityOverlapsExistingEntity;
