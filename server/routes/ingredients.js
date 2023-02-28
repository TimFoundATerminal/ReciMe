const express = require('express');
const router = express.Router();
const ingredientsModel = require('../models/ingredients')
const {param, body, validationResult} = require('express-validator')
const {handleValidator} = require('../middleware/validation')

/**
 * @swagger
 * /ingredients:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Retrieve all ingredients
 *     description: Retrieve all the ingredients 
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ingredient'
 *               
*/
router.get('/', function(req, res, next) {
    try {
        res.status(200).json(ingredientsModel.getAll());
      } catch(err) {
        next(err);
      }
  });

  /**
 * @swagger
 * /ingredients/{ingredientID}:
 *   get:
 *     tags:
 *       - Ingredients
 *     summary: Retrieve a specific ingredient 
 *     parameters:
 *       - name: ingredientID
 *         in: path
 *         description: ID of ingredient to return
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/ingredient'
 *       '400':
 *          description: Invalid ID  
 *           
*/
router.get('/:ingredientID', param('ingredientID').isInt(),handleValidator, function(req, res, next) {
    try {
        res.status(200).json(ingredientsModel.getIngredient(req.params.ingredientID));
      } catch(err) {
        next(err);
      }
  });

  /**
 * @swagger
 * /ingredients:
 *   post:
 *     tags:
 *       - Ingredients
 *     summary: Add a new ingredient 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ingredientPost'
 *     responses:
 *       '200':
 *         description: Successful operation  
 *       '400':
 *          description: Invalid request body
 *           
*/
router.post('/', 
body('name').isString().exists(),
body('standardUnit').isString().exists(),
body('carbonPerUnit').isFloat().exists(),
handleValidator,
function(req, res, next) {
    try {
        res.status(200).json(ingredientsModel.createIngredient(req.body));
    } catch(err) {
    next(err);
    }
});

/**
 * @swagger
 * /ingredients/{ingredientID}:
 *   delete:
 *     tags:
 *       - Ingredients
 *     summary: Delete a specific ingredient 
 *     parameters:
 *       - name: ingredientID
 *         in: path
 *         description: ID of ingredient to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *       '400':
 *          description: Invalid ID
 *           
*/
router.delete('/:ingredientID', param('ingredientID').isInt(),handleValidator,function(req, res, next) {
      try {
          res.status(200).json(ingredientsModel.deleteIngredient(req.params.ingredientID));
      } catch(err) {
      next(err);
      }
  });

  module.exports = router;