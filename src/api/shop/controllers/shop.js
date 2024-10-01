'use strict';

/**
 * shop controller
 */

// path: src/api/shop/controllers/shop.js
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::shop.shop', ({ strapi }) => ({

  // Custom action to return 'Hello World'
  async test(ctx) {
    ctx.body = "Hello World"; // Returns a simple "Hello World" response
  },
}));
