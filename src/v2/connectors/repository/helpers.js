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

exports.findMany = async (bookShelfModel, conditions = {}, withRelated = []) => {
  const result = await bookShelfModel
    .forge()
    .where(conditions)
    .fetchAll({ require: false, withRelated });

  return result.toJSON();
};

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save();
  return model.toJSON();
};

exports.deleteOne = async (bookShelfModel, idKey, id) => {
  return bookShelfModel
    .forge({ [idKey]: id })
    .destroy();
};

exports.deleteTestData = async (bookShelfModel) => {
  return bookShelfModel.forge().where({ is_test: true }).destroy({
    require: false
  });
};
