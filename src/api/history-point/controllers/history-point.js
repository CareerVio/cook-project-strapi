'use strict';

/**
 * A set of functions called "actions" for `history-point`
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::history-point.history-point', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { shopName, date, time, totalPoint, userId } = ctx.request.body.data;

      // Validate required fields
      if (!shopName || !totalPoint || !userId) {
        return ctx.badRequest('Missing required fields');
      }

      // Create the new history-machine entry
      const newHistoryEntry = await strapi.service('api::history-point.history-point').create({
        data: {
          shopName,
          date,
          time,
          totalPoint,
          userId
        },
      });

      return ctx.created(newHistoryEntry);
    } catch (err) {
      console.log(err);
      // ctx.badRequest('An error occurred', { error: err.message });
    }
  },

  async find(ctx) {
    // Custom find logic if needed
    return await super.find(ctx);
  },
}));
