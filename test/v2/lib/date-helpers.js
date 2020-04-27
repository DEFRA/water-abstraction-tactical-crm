'use strict';

const { expect } = require('@hapi/code');
const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script();

const dateHelpers = require('../../../src/v2/lib/date-helpers');

experiment('v2/lib/date-helpers', () => {
  experiment('.newEntityOverlapsExistingEntity', () => {
    let existingEntity, newEntity;

    beforeEach(() => {
      existingEntity = { startDate: '2018-05-03', endDate: '2020-12-31' };
      newEntity = { startDate: '2020-04-01', endDate: null };
    });

    test('returns true when dates in the entities overlap', () => {
      const result = dateHelpers.newEntityOverlapsExistingEntity(existingEntity, newEntity);
      expect(result).to.be.true();
    });

    test('returns true when existing entity has a null end date', () => {
      existingEntity.endDate = null;

      const result = dateHelpers.newEntityOverlapsExistingEntity(existingEntity, newEntity);
      expect(result).to.be.true();
    });

    test('returns false when the dates do not overlap', () => {
      newEntity.startDate = '2021-01-01';
      const result = dateHelpers.newEntityOverlapsExistingEntity(existingEntity, newEntity);
      expect(result).to.be.false();
    });

    test('does not throw when end date is undefined', () => {
      newEntity = { startDate: '2021-01-01' };
      const func = () => dateHelpers.newEntityOverlapsExistingEntity(existingEntity, newEntity);
      expect(func).not.to.throw();
    });
  });
});
