'use strict';

exports.findOne = async (bookshelfModel, idKey, id) => {
  const result = await bookshelfModel
    .forge({ [idKey]: id })
    .fetch();

  return result ? result.toJSON() : null;
};

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save();
  return model.toJSON();
};
