import swaggerJsDoc from 'swagger-jsdoc';

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
  apis: ['./src/v1/**/*.{ts,yaml}'],
});
