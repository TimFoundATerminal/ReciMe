/* eslint-disable no-multi-str */
const db = require('./db')

async function getAll () {
  const data = await db.query(
    'SELECT * \
        FROM pantry\
        INNER JOIN ingredients on ingredients.ingredientID = pantry.ingredientID',
    [])
  return data
}

async function getItem (id) {
  const data = await db.queryRow('SELECT * FROM pantry INNER JOIN ingredients on ingredients.ingredientID = pantry.ingredientID WHERE itemID = ?', id)
  return data
}

async function createItem (pantryObj) {
  const result = await db.run(
    'INSERT INTO pantry (ingredientID, quantity, dateExpiry, frozen) \
         VALUES (?, ?, ?, ?)', Object.values(pantryObj))
  return { message: db.validateChanges(result, 'Pantry item created successfully', 'Error in creating pantry item') }
}

async function deleteItem (id) {
  const result = await db.run(
    'DELETE FROM pantry WHERE itemID = ?', id)
  return { message: db.validateChanges(result, 'Pantry item deleted successfully', 'Error deleting pantry item') }
}

async function updateItem (id, body) {
  if (Object.keys(body).length === 0) {
    const error = new Error('Request body can\'t be blank')
    error.statusCode = 400
    throw error
  }
  let sqlStatement = 'UPDATE pantry SET '
  for (const key in body) {
    sqlStatement = sqlStatement + key.toString() + ' = ?'
    if (key === Object.keys(body)[Object.keys(body).length - 1]) {
      sqlStatement = sqlStatement + ' '
    } else {
      sqlStatement = sqlStatement + ', '
    }
  }
  sqlStatement = sqlStatement + 'WHERE itemID = ?'
  const vals = Object.values(body)
  vals.push(id)
  const result = await db.run(sqlStatement, vals)
  return { message: db.validateChanges(result, 'Pantry item updated successfully', 'Error updating pantry item') }
}

module.exports = {
  getAll,
  getItem,
  createItem,
  deleteItem,
  updateItem
}
