'use strict';

/**
 * history-machine controller
 */
// const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::history-machine.history-machine');

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::history-machine.history-machine', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { type, date, time, serialNumber, point, userId } = ctx.request.body;

      // Validate required fields
      if (!type || !serialNumber || !point || !userId) {
        return ctx.badRequest('Missing required fields');
      }

      // Create the new history-machine entry
      const newHistoryEntry = await strapi.service('api::history-machine.history-machine').create({
        data: {
          type,
          date,
          time,
          serialNumber,
          point,
          userId,
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
