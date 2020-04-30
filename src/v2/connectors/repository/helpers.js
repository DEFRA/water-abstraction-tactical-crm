'use strict';
const { snakeCase } = require('lodash');

exports.findOne = async (bookshelfModel, idKey, id, withRelated = []) => {
  const result = await bookshelfModel
    .forge({ [idKey]: id })
    .fetch({
      withRelated,
      require: false
    });

  return result && result.toJSON();
};

exports.findAll = async (bookshelfModel, idKey, id) => {
  const result = await bookshelfModel
    .forge()
    .where({ [snakeCase(idKey)]: id })
    .fetchAll({ require: false });

  return result.toJSON();
};

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save();
  return model.toJSON();
};
