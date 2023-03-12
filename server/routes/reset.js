const express = require('express')
const resetModel = require('../models/reset')
const router = express.Router()

/**
 * @swagger
 * /reset:
 *   delete:
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
router.delete('/', async function (req, res, next) {
  try {
    res.status(200).json(await resetModel.reset())
  } catch (err) {
    next(err)
  }
})

module.exports = router
