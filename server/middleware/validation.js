const { validationResult } = require('express-validator')
const ingredientModel = require('../models/ingredients')

function handleValidator (req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

async function ingredientExists (req, res, next) {
  const ingredient = await ingredientModel.getIngredient(req.body.ingredientID)
  if (Object.keys(ingredient).length === 0) {
    const error = new Error('IngredientID does not exist')
    error.statusCode = 400
    next(error)
  }
  next()
}

module.exports = {
  handleValidator,
  ingredientExists
}
