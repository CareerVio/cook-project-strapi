// @ts-nocheck
'use strict';

/**
 * history-point service
 */

// 'use strict';

// module.exports = {
//   async create(data) {
//     return strapi.entityService.create('api::history-point.history-point', {
//       data,
//     });
//   },

//   async find() {
//     return strapi.entityService.findMany('api::history-point.history-point');
//   }
// };
const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::history-point.history-point', ({ strapi }) => ({
  async create(params) {
    // Custom logic before creating a new entry
    const entry = await strapi.query('api::history-point.history-point').create({
      data: {
        shopName: params.data.shopName,
        date: params.data.date,
        time: params.data.time,
        totalPoint: params.data.totalPoint,
        userId: params.data.userId,
      },
    });
    return entry;
  },
}));
