import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PrimeTrade API',
      version: '1.0.0',
      description: 'Secure, scalable REST API with auth and RBAC'
    },
    servers: [{ url: '/api/v1' }]
  },
  apis: ['src/routes/**/*.js', 'src/models/**/*.js']
};

const swaggerSpec = swaggerJSDoc(options);
const outputDir = path.join(process.cwd(), 'src', 'docs');
const outputFile = path.join(outputDir, 'openapi.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));
// eslint-disable-next-line no-console
console.log('Swagger spec generated at', outputFile);



