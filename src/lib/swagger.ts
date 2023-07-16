import swaggerJsDoc from 'swagger-jsdoc';

const BASE_URL = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

export const swaggerSpec = swaggerJsDoc({
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Takehome',
      version: '1.0.0',
      description:
        'This is a REST API made with Express for the takehome assessment.',
      license: {
        name: 'Licensed Under MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL,
      },
    ],
  },
  apis: [`./${BASE_URL}/v1/**/*.{js,ts,yaml}`],
});
