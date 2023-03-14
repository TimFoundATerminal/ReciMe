const express = require('express')
const resetModel = require('../models/reset')
const router = express.Router()

/**
 * @swagger
 * /reset/defaultIngredients:
 *   get:
 *     tags:
 *       - Reset
 *     summary: Reset the db to just ingredients
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *       '400':
 *          description: Invalid ID
 *
*/
router.get('/defaultIngredients', async function (req, res, next) {
  try {
    res.status(200).json(await resetModel.resetToIngredients())
  } catch (err) {
    next(err)
  }
})

/**
 * @swagger
 * /reset/testData:
 *   get:
 *     tags:
 *       - Reset
 *     summary: Reset the db to test data
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *       '400':
 *          description: Invalid ID
 *
*/
router.get('/testData', async function (req, res, next) {
  try {
    res.status(200).json(await resetModel.resetToTest())
  } catch (err) {
    next(err)
  }
})

module.exports = router
