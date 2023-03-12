const db = require('./db')

async function reset () {
  await db.reset('pantry')
  await db.reset('waste')
  return { message: 'DB reset succesfully' }
}

module.exports = {
  reset
}
