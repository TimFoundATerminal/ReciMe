process.env.MYSQL_PWD = 'LT1caP25I4'
process.env.ENVIRONMENT = 'production'

if (process.env.ENVIRONMENT === 'production') {
  module.exports = require('./db-mysql')
} else {
  module.exports = require('./db-sqlite')
}
