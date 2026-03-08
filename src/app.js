const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const sitesRoutes = require('./routes/sites.routes');
const assetsRoutes = require('./routes/assets.routes');
const dailyChecksRoutes = require('./routes/dailyChecks.routes');
const maintenanceRoutes = require('./routes/maintenance.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger OpenAPI configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Security Management System API',
      version: '1.0.0',
      description: 'API for managing security screening devices, daily inspections, and maintenance across airports.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message' },
          },
        },
        ValidationErrors: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: { type: 'string' },
              example: ['email is required', 'password is required'],
            },
          },
        },
      },
    },
  },
  apis: [path.join(__dirname, 'routes', '*.js')],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Security Management System API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// API v1 routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/sites', sitesRoutes);
app.use('/api/v1/assets', assetsRoutes);
app.use('/api/v1/daily-checks', dailyChecksRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);

module.exports = app;
