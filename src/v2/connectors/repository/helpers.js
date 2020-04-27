'use strict';
const { snakeCase } = require('lodash');

exports.findOne = async (bookshelfModel, idKey, id) => {
  const result = await bookshelfModel
    .forge({ [idKey]: id })
    .fetch({ require: false });

  return result && result.toJSON();
};

exports.findMostRecent = async (bookshelfModel, idKey, id) => {
  const [result] = await bookshelfModel
    .forge()
    .where({ [snakeCase(idKey)]: id })
    .orderBy('start_date', 'desc')
    .fetchPage({ page: 1, pageSize: 1 });

  return result && result.toJSON();
};

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save();
  return model.toJSON();
};
