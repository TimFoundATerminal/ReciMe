const db = require('better-sqlite3')('db.sqlite')

function query (sql, params) {
  return db.prepare(sql).all(params)
}

function queryRow (sql, id) {
  const data = db.prepare(sql).get(id[0])
  return (!data ? {} : data)
}

function run (sql, params) {
  return db.prepare(sql).run(params)
}

function reset (table) {
  return db.prepare(`DELETE FROM ${table}`).run()
}

function validateChanges (result, passMsg, failMsg) {
  let message = failMsg
  if (result.changes) {
    message = passMsg
  } else {
    const error = new Error(message)
    error.statusCode = 400
    throw error
  }
  return message
}

module.exports = {
  query,
  queryRow,
  run,
  validateChanges,
  reset
}
