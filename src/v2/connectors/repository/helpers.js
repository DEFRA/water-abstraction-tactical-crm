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
  try {
    const model = await bookShelfModel.forge(data).save();
    return model.toJSON();
  } catch (err) {
    if (parseInt(err.code) === 23505) {
      // In the event of a Unique constraint breach, return the original row
      const params = err.detail.match(/\(([^)]+)\)/g);
      const column = params[0].slice(1, -1);
      const value = params[1].slice(1, -1);

      const model = await bookShelfModel.forge({ [column]: value })
        .fetch();
      return model.toJSON();
    }
    throw err;
  };
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
