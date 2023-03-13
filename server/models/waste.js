/* eslint-disable no-multi-str */
const db = require('./db')
const ingredientModel = require('./ingredients')

async function getAll (dateBefore, dateAfter) {
  const data = await db.query(
    'SELECT * \
        FROM waste\
        INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID\
        and dateThrownAway < ? and dateThrownAway > ?',
    [dateBefore, dateAfter])
  return data
}

async function getLog (id) {
  const data = await db.queryRow('SELECT * FROM waste INNER JOIN ingredients on ingredients.ingredientID = waste.ingredientID WHERE wasteID = ?', id)
  return data
}

async function createLog (wasteObj) {
  const ingredient = await ingredientModel.getIngredient(wasteObj.ingredientID)
  wasteObj.carbonWasted = (wasteObj.quantity * ingredient.carbonPerUnit).toFixed(2)
  const result = await db.run(
    'INSERT INTO waste (ingredientID, dateThrownAway, quantity, carbonWasted) \
        VALUES (?, ?, ?, ?)', Object.values(wasteObj))
  return { message: db.validateChanges(result, 'Waste log created successfully', 'Error in creating waste log') }
}

async function deleteLog (id) {
  const result = await db.run(
    'DELETE FROM waste WHERE wasteID = ?', id)
  return { message: db.validateChanges(result, 'Waste log deleted successfully', 'Error deleting waste log') }
}

async function sumCarbon (dateBefore, dateAfter) {
  const data = await db.query(
    'SELECT SUM(carbonWasted) \
        FROM waste WHERE dateThrownAway < ? and dateThrownAway > ?',
    [dateBefore, dateAfter])
  return { total: data[0]['SUM(carbonWasted)'].toFixed(2) }
}

module.exports = {
  getAll,
  getLog,
  createLog,
  deleteLog,
  sumCarbon
}
