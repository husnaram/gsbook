const express = require('express');

require('dotenv').config();

const morgan = require('morgan');
const helmet = require('helmet');

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "GSBook",
      description: "Guestbook API documentation - Make sure the endpoint that require authorization add 'Bearer' prefix into the value, so it's like this 'Bearer [token]'.",
      contact: {
        name: "Amazing Developer"
      },
      servers: ["http://localhost:5000"]
    },
  },
  apis: ['./docs/*.yaml']
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);

const app = express();
const api = require('./src/api');

app.get('/', (request, response) => response.sendStatus(200));
app.get('/health', (request, response) => response.sendStatus(200));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(morgan('short'));
app.use(express.json());
app.use(helmet());

app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};
