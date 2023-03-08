const express = require('express');
const router = express.Router();
const pantry = require('./pantry');
const ingredients = require('./ingredients');
const waste = require('./waste');
const reset = require('./reset')

router.use('/pantry', pantry);
router.use('/ingredients', ingredients);
router.use('/waste', waste);
router.use('/reset', reset)

module.exports = router;
