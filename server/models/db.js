const db = require('better-sqlite3')('db.sqlite');

function query(sql, params) {
  return db.prepare(sql).all(params);
}

function queryRow(sql, id) {
  var data = db.prepare(sql).get(id)
  return (!data ? {} : data);
}

function run(sql, params) {
  return db.prepare(sql).run(params);
}

function validateChanges(result, passMsg, failMsg) {
  let message = failMsg;
    if (result.changes) {
      message = passMsg;
    } else {
        let error = new Error(message);
        error.statusCode = 400;
        throw error;
    }
  return message
}

module.exports = {
  query,
  queryRow, 
  run,
  validateChanges
}