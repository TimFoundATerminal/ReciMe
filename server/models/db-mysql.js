const mysql = require('mysql2')

const connection = mysql.createConnection({
  host: 'sql8.freemysqlhosting.net',
  user: 'sql8604631',
  password: process.env.MYSQL_PWD,
  database: 'sql8604631',
  port: 3306
}).promise()

async function query (sql, params) {
  const [result] = await connection.query(sql, params)
  return result
}

async function queryRow (sql, id) {
  const [data] = await connection.query(sql, id)
  return (!data[0] ? {} : data[0])
}

async function run (sql, params) {
  const [result] = await connection.query(sql, params)
  return result
}

async function reset (table) {
  const [result] = await connection.query(`TRUNCATE TABLE ${table}`)
  return result
}

function validateChanges (result, passMsg, failMsg) {
  let message = failMsg
  if (result.affectedRows >= 1) {
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
