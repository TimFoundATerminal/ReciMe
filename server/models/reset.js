const db = require('./db')
const factoryHelpers = require('../utils/factory_helpers')

async function clear () {
  await db.reset('pantry')
  await db.reset('waste')
}

async function resetToIngredients () {
  await clear()
  return { message: 'DB reset succesfully' }
}

async function resetToTest () {
  await clear()
  factoryHelpers.poplulatePantry()
  factoryHelpers.poplulateImpact()
  return { message: 'DB reset succesfully' }
}

module.exports = {
  resetToIngredients,
  resetToTest
}
