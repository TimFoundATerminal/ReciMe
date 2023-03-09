// Swagger setup
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = require('./openAPI.js');

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
const swaggerUi = require('swagger-ui-express');

var express = require('express');
var bodyParser = require('body-parser');

const app = express();
const api = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', api);

app.use(function(req, res) {
    res.status(404).send({message: 'Resource not found'});
});

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 400;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
    next()
});
  
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server listening on port ${port}`))

module.exports = app;
