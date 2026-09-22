import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'StockPilot Commerce API', version: '1.0.0', description: 'Inventory, cart and transaction-safe order management API.' },
    servers: [{ url: '/api' }],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
    paths: {
      '/health': { get: { summary: 'Service health', responses: { '200': { description: 'Healthy' } } } },
      '/auth/register': { post: { summary: 'Register customer', responses: { '201': { description: 'Created' } } } },
      '/auth/login': { post: { summary: 'Login and receive JWT', responses: { '200': { description: 'Authenticated' } } } },
      '/products': { get: { summary: 'List products with search and pagination', responses: { '200': { description: 'Product page' } } }, post: { summary: 'Create product (Admin)', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Created' } } } },
      '/categories': { get: { summary: 'List categories', responses: { '200': { description: 'Categories' } } } },
      '/cart': { get: { summary: 'View current cart', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Cart' } } }, post: { summary: 'Add or update cart item', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Updated cart item' } } } },
      '/orders/checkout': { post: { summary: 'Create order and atomically reduce stock', security: [{ bearerAuth: [] }], responses: { '201': { description: 'Order created' }, '409': { description: 'Insufficient stock' } } } },
      '/orders': { get: { summary: 'List permitted orders', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Orders' } } } }
    }
  }, apis: []
});
