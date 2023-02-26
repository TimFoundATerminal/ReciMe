const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'ES backend',
      version: '1.0.0',
      description: 'Docs for using the REST API backend'
    },
    servers: [
      {
          url: 'http://localhost:3000/api',
          description: 'Local server'
      }
    ],
    tags: [
      {
        name: 'Pantry',
        description: 'Pantry endpoints'
      }, 
      {
        name: 'Ingredients',
        description: 'Ingredients endpoints'
      },
      {
        name: 'Waste',
        description: 'Waste endpoints for handling food thrown away'
      }
    ],
    components: {
      schemas: {
        pantry: {
          type: 'object',
          properties: {
            itemID: {
              type: 'integer'
            },
            ingredientID: {
              type: 'integer'
            },
            quantity: {
              type: 'float',
              example: 100.0
            },
            dateAdded: {
              type: 'string',
              example: '2023-02-24'
            },
            dateExpiry: {
              type: 'string',
              example: '2023-02-24'
            },
            frozen: {
              type: 'int',
              example: 1
            }
          }
        },
        pantryPost: {
          type: 'object',
          properties: {
            ingredientID: {
              type: 'integer'
            },
            quantity: {
              type: 'float',
              example: 100.0
            },
            dateAdded: {
              type: 'string',
              example: '2023-02-24'
            },
            dateExpiry: {
              type: 'string',
              example: '2023-02-24'
            },
            frozen: {
              type: 'int',
              example: 1
            }
          }
        },
        ingredient: {
          type: 'object',
          properties: {
            ingredientID: {
              type: 'integer'
            },
            name: {
              type: 'string',
              example: 'Chicken Breast'
            },
            standardUnit: {
              type: 'string',
              example: 'grams'
            },
            carbonPerUnit: {
              type: 'integer',
              example: 20
            },
          }
        },
        ingredientPost: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Chicken Breast'
            },
            standardUnit: {
              type: 'string',
              example: 'grams'
            },
            carbonPerUnit: {
              type: 'integer',
              example: 20
            },
          }
        },
        waste: {
          type: 'object',
          properties: {
            wasteID: {
              type: 'string'
            },
            ingredientID: {
              type: 'string'
            },
            dateThrownAway: {
              type: 'string',
              example: '2023-02-26'
            },
            quantity: {
              type: 'float',
              example: '50.5'
            }
          }
        },
        wastePost: {
          type: 'object',
          properties: {
            ingredientID: {
              type: 'string'
            },
            dateThrownAway: {
              type: 'string',
              example: '2023-02-26'
            },
            quantity: {
              type: 'float',
              example: '50.5'
            }
          }
        }
      }
    }
  };

  module.exports = swaggerDefinition;