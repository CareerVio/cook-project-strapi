'use strict';

/**
 * shop router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::shop.shop');
// module.exports = {
//   routes: [
//     {
//       method: 'GET',
//       path: '/shops/test',
//       handler: 'shop.test',
//       config: {
//         policies: [],
//         middlewares: [],
//       },
//     },
//   ],
// };
