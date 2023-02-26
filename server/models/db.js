const db = require('better-sqlite3')('db.sqlite');
const path = require('path');
// const db = new sqlite(path.resolve('db.sqlite'), {fileMustExist: true});

function query(sql, params) {
  return db.prepare(sql).all(params);
}

function queryRow(sql, id) {
  data = db.prepare(sql).get(id)
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

function validateNotEmpty(data) {
  console.log(data)
  let error = new Error('ID does not exist')
}

module.exports = {
  query,
  queryRow, 
  run,
  validateChanges
}