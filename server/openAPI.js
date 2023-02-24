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
        description: "Pantry endpoints"
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
        }
      }
    }
  };

  module.exports = swaggerDefinition;