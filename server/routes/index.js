const express = require('express');
const router = express.Router();
// const users = require('./users')
const pantry = require('./pantry')

router.use('/pantry', pantry)

module.exports = router;
