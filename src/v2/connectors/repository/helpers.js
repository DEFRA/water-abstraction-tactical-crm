'use strict'

const findOneBy = async (bookshelfModel, query = {}, withRelated = []) => {
  const result = await bookshelfModel
    .forge(query)
    .fetch({
      withRelated,
      require: false
    })

  return result && result.toJSON()
}

exports.findOne = async (bookshelfModel, idKey, id, withRelated = []) =>
  findOneBy(bookshelfModel, { [idKey]: id }, withRelated)

exports.findAll = async (bookshelfModel, idKey, id) => {
  const result = await bookshelfModel
    .forge()
    .where({ [camelToSnakeCase(idKey)]: id })
    .fetchAll({ require: false })

  return result.toJSON()
}

/**
 * The regex below is split into two parts
 * The first part /([A-Z])/g is matching any uppercase character in the whole string
 * (the /g means global so it matches every character not just the first one)
 * The next part '_$1' is then inserting an underscore after each matched character
 * We then convert this new string into lower case
 * This changes it from camelCase to snake_case
 */
function camelToSnakeCase (key) {
  const result = key.replace(/([A-Z])/g, '_$1')
  return result.toLowerCase()
}

exports.findMany = async (bookShelfModel, conditions = {}, withRelated = []) => {
  const result = await bookShelfModel
    .forge()
    .where(conditions)
    .fetchAll({ require: false, withRelated })

  return result.toJSON()
}

exports.create = async (bookShelfModel, data) => {
  const model = await bookShelfModel.forge(data).save()
  return model.toJSON()
}

exports.deleteOne = async (bookShelfModel, idKey, id) => {
  return bookShelfModel
    .forge({ [idKey]: id })
    .destroy()
}

exports.deleteTestData = async (bookShelfModel) => {
  return bookShelfModel.forge().where({ is_test: true }).destroy({
    require: false
  })
}

exports.update = async (bookshelfModel, idKey, id, changes) => {
  const result = await bookshelfModel
    .forge({ [idKey]: id })
    .save(changes)

  return result && result.toJSON()
}

exports.findOneBy = findOneBy
