const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Contacts API',
    description: 'A simple API to manage contacts'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./routes/index.js'];

//this will generate swagger-output.json in the root folder
swaggerAutogen(outputFile, endpointsFiles, doc);