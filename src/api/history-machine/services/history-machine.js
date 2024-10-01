'use strict';

/**
 * history-machine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::history-machine.history-machine', ({ strapi }) => ({
  async create(params) {
    // Custom logic before creating a new entry
    const entry = await strapi.query('api::history-machine.history-machine').create({
      data: {
        type: params.data.type,
        date: params.data.date,
        time: params.data.time,
        serialNumber: params.data.serialNumber,
        point: params.data.point,
        userId: params.data.userId,
      },
    });
    return entry;
  },
}));
