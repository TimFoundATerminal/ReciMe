const db = require('better-sqlite3')('db.sqlite');
const path = require('path');
// const db = new sqlite(path.resolve('db.sqlite'), {fileMustExist: true});

function query(sql, params) {
  return db.prepare(sql).all(params);
}

function queryRow(sql, id) {
  return db.prepare(sql).get(id);
}

function run(sql, params) {
  return db.prepare(sql).run(params);
}

module.exports = {
  query,
  queryRow, 
  run
}