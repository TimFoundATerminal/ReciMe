const db = require('./db')

async function getAll () {
  const data = await db.query('SELECT * FROM ingredients', [])
  return data
}

async function getIngredient (id) {
  const data = await db.queryRow('SELECT * FROM ingredients WHERE ingredientID = ?', [id])
  return data
}

async function createIngredient (ingredientObj) {
  const result = await db.run('INSERT INTO ingredients (name, standardUnit, carbonPerUnit) VALUES (?, ?, ?)', Object.values(ingredientObj))
  return { message: db.validateChanges(result, 'Ingredient created successfully', 'Error in creating ingredient') }
}

async function deleteIngredient (id) {
  const result = await db.run(
    'DELETE FROM ingredients WHERE ingredientID = ?', [id])
  return { message: db.validateChanges(result, 'ingredient deleted successfully', 'Error deleting ingredient') }
}

module.exports = {
  getAll,
  createIngredient,
  deleteIngredient,
  getIngredient
}
