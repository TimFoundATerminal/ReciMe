if (process.env.ENVIRONMENT === 'production') {
  module.exports = require('./db-mysql')
} else {
  module.exports = require('./db-sqlite')
}
