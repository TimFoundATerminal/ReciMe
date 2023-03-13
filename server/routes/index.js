const express = require('express');
const router = express.Router();
const pantry = require('./pantry');
const ingredients = require('./ingredients');
const waste = require('./waste')

router.use('/pantry', pantry);
router.use('/ingredients', ingredients);
router.use('/waste', waste);

module.exports = router;
