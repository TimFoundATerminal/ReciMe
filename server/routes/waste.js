const express = require('express');
const router = express.Router();
const wasteModel = require('../models/waste')
const {param, body, query, validationResult} = require('express-validator')
const {handleValidator, ingredientExists} = require('../middleware/validation')

/**
 * @swagger
 * /waste:
 *   get:
 *     tags:
 *       - Waste
 *     summary: Retrieve all waste
 *     description: Retrieve all the waste logs 
 *     parameters:
 *       - name: dateBefore
 *         in: query
 *         description: Filter results to before dateBefore
 *         required: false
 *         schema:
 *           type: integer
*       - name: dateAfter
 *         in: query
 *         description: Filter results to after dateAfter
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/waste'
 *               
*/
query('dateBefore').isInt().optional(),
query('dateAfter').isInt().optional(),
handleValidator,
router.get('/', function(req, res, next) {
    try {
      dateBefore = 'dateBefore' in req.query ? req.query.dateBefore: 99999999
      dateAfter = 'dateAfter' in req.query ? req.query.dateAfter: 0
        res.status(200).json(wasteModel.getAll(dateBefore, dateAfter));
      } catch(err) {
        next(err);
      }
  });

  /**
 * @swagger
 * /waste/{wasteID}:
 *   get:
 *     tags:
 *       - Waste
 *     summary: Retrieve a specific waste log 
 *     parameters:
 *       - name: wasteID
 *         in: path
 *         description: ID of waste log to return
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/waste'
 *       '400':
 *          description: Invalid ID  
 *           
*/
router.get('/:wasteID', param('wasteID').isInt(),handleValidator,function(req, res, next) {
    try {
        res.status(200).json(wasteModel.getLog(req.params.wasteID));
      } catch(err) {
        next(err);
      }
  });

  /**
 * @swagger
 * /waste:
 *   post:
 *     tags:
 *       - Waste
 *     summary: Add a new waste log 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/wastePost'
 *     responses:
 *       '200':
 *         description: Successful operation  
 *       '400':
 *          description: Invalid request body
 *           
*/
router.post('/', 
body('ingredientID').isInt().exists(),
body('dateThrownAway').isInt().exists(),
body('quantity').isFloat().exists(),
handleValidator,
ingredientExists,
function(req, res, next) {
    try {
        res.status(200).json(wasteModel.createLog(req.body));
    } catch(err) {
    next(err);
    }
});

/**
 * @swagger
 * /waste/{wasteID}:
 *   delete:
 *     tags:
 *       - Waste
 *     summary: Delete a specific waste log 
 *     parameters:
 *       - name: wasteID
 *         in: path
 *         description: ID of waste to delete
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
router.delete('/:wasteID', param('wasteID').isInt(),handleValidator,function(req, res, next) {
      try {
          res.status(200).json(wasteModel.deleteLog(req.params.wasteID));
      } catch(err) {
      next(err);
      }
  });

module.exports = router;