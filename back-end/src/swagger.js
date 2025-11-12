const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Your API Title',
    description: 'Description of your API',
  },
  host: 'test.com',
  schemes: ['https', 'http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/server.ts'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger schema generated: ' + outputFile);
});
