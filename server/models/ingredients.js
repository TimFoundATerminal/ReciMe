/* eslint-disable no-multi-str */
const db = require('./db')

function getAll () {
  const data = db.query('SELECT * FROM ingredients', [])
  return data
}

function getIngredient (id) {
  const data = db.queryRow('SELECT * FROM ingredients WHERE ingredientID = ?', id)
  return data
}

function createIngredient (ingredientObj) {
  const result = db.run('INSERT INTO ingredients (name, standardUnit, carbonPerUnit) VALUES \
    (@name, @standardUnit, @carbonPerUnit)', ingredientObj)
  return { message: db.validateChanges(result, 'Ingredient created successfully', 'Error in creating ingredient') }
}

function deleteIngredient (id) {
  const result = db.run(
    'DELETE FROM ingredients WHERE ingredientID = @id', { id })
  return { message: db.validateChanges(result, 'ingredient deleted successfully', 'Error deleting ingredient') }
}

module.exports = {
  getAll,
  createIngredient,
  deleteIngredient,
  getIngredient
}
