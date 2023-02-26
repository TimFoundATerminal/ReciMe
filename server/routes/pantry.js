const express = require('express');
const router = express.Router();
const pantryModel = require('../models/pantry')
const {param, body, validationResult} = require('express-validator')
const {handleValidator} = require('../middleware/validation')

/**
 * @swagger
 * /pantry:
 *   get:
 *     tags:
 *       - Pantry
 *     summary: Retrieve all pantry items
 *     description: Retrieve all items from the pantry. 
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/pantry'
 *               
*/
router.get('/', function(req, res, next) {
    try {
        res.status(200).json(pantryModel.getAll());
      } catch(err) {
        next(err);
      }
  });

/**
 * @swagger
 * /pantry/{itemID}:
 *   get:
 *     tags:
 *       - Pantry
 *     summary: Retrieve a specific item 
 *     parameters:
 *       - name: itemID
 *         in: path
 *         description: ID of pantry item to return
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/pantry'
 *       '400':
 *          description: Invalid ID  
 *           
*/
router.get('/:itemID', param('itemID').isInt(),handleValidator,function(req, res, next) {
    try {
        res.status(200).json(pantryModel.getItem(req.params.itemID));
      } catch(err) {
        next(err);
      }
  });

/**
 * @swagger
 * /pantry/{itemID}:
 *   delete:
 *     tags:
 *       - Pantry
 *     summary: Delete a specific item 
 *     description: Deletes a specific pantry item
 *     parameters:
 *       - name: itemID
 *         in: path
 *         description: ID of pantry item to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *       '400':
 *          description: Invalid
 *           
*/
router.delete('/:itemID', param('itemID').isInt(),handleValidator,function(req, res, next) {
      try {
          res.status(200).json(pantryModel.deleteItem(req.params.itemID));
      } catch(err) {
      next(err);
      }
  });

/**
 * @swagger
 * /pantry:
 *   post:
 *     tags:
 *       - Pantry
 *     summary: Add a new pantry item 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pantryPost'
 *     responses:
 *       '200':
 *         description: Successful operation  
 *       '400':
 *          description: Invalid request body
 *           
*/
  router.post('/', 
    body('ingredientID').isInt().exists(), 
    body('quantity').isFloat().exists(), 
    body('dateAdded').isISO8601('yyyy-mm-dd').exists(), 
    body('dateExpiry').isISO8601('yyyy-mm-dd').exists(),
    body('frozen').isInt({min:0, max:1}).exists(),
    handleValidator, 
    function(req, res, next) {
      try {
          res.status(200).json(pantryModel.createItem(req.body));
      } catch(err) {
      next(err);
      }
  });

    /**
 * @swagger
 * /pantry/{itemID}:
 *   put:
 *     tags:
 *       - Pantry
 *     summary: Update a specific item 
 *     description: Note only one or more of the properties is required.
 *     parameters:
 *       - name: itemID
 *         in: path
 *         description: ID of pantry item to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/pantryPost'
 *     responses:
 *       '200':
 *         description: Successful operation
 *       '400':
 *          description: Invalid ID or request body              
 *           
*/
router.put('/:itemID', 
    param('itemID').isInt().optional(),
    body('ingredientID').isInt().optional(), 
    body('quantity').isFloat().optional(), 
    body('dateAdded').isISO8601('yyyy-mm-dd').optional(), 
    body('dateExpiry').isISO8601('yyyy-mm-dd').optional(),
    body('frozen').isInt({min:0, max:1}).optional(), 
    handleValidator,
    function(req, res, next) {
        try {
            res.status(200).json(pantryModel.updateItem(req.params.itemID, req.body));
        } catch(err) {
            next(err);
        }
  });

  module.exports = router;
  