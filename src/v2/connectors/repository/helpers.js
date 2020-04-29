'use strict';

exports.findOne = async (bookshelfModel, idKey, id, withRelated = []) => {
  const result = await bookshelfModel
    .forge({ [idKey]: id })
    .fetch({
      withRelated,
      require: false
    });

  return result && result.toJSON();
};

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save();
  return model.toJSON();
};
