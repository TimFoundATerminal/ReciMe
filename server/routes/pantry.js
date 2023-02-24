const express = require('express');
const router = express.Router();
const pantryModel = require('../models/pantry')
const {param, body, validationResult} = require('express-validator')

/**
 * @swagger
 * /pantry:
 *   get:
 *     tags:
 *       - Pantry
 *     summary: Retrieve all pantry items
 *     description: Retrieve all items from the pantry.
 *     parameters:
 *       -name: itemID
 *       in: param
 *       description: ID of item to retrieve
 *       required: true
 *       scheme: 
 *         type: integer   
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
        console.error(`Error while getting pantry items `, err.message);
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
router.get('/:itemID', param('itemID').isInt(),function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        res.status(200).json(pantryModel.getRow(req.params.itemID));
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     example: Pantry item deleted successfully
 *       '400':
 *          description: Invalid ID  
 *           
*/
router.delete('/:itemID', param('itemID').isInt(),function(req, res, next) {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(405).json({ errors: errors.array() });
        }
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
 *             $ref: '#/components/schemas/pantry'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                     type: string
 *                     example: Pantry item created successfully
 *                 
 *       '405':
 *          description: Invalid request body
 *           
*/
  router.post('/', 
    body('ingredientID').isInt(), 
    body('quantity').isFloat(), 
    body('dateAdded').isISO8601('yyyy-mm-dd'), 
    body('dateExpiry').isISO8601('yyyy-mm-dd'),
    body('frozen').isInt({min:0, max:1}), 
    function(req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(405).json({ errors: errors.array() });
        }
        try {
            res.status(200).json(pantryModel.createItem(req.body));
        } catch(err) {
        next(err);
        }
  });

  module.exports = router;
  