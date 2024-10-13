'use strict';

/**
 * A set of functions called "actions" for `product-bot`
 */

module.exports = {
  checkStockAction: async (ctx, next) => {
    try {
      ctx.body = 'ok';
      const shops = await strapi.entityService.findMany('api::shop.shop', {
        populate: {
          products: {
            filters: {
              numStock: {
                $lt: 5, // Filter products with numStock less than 5
              },
            },
          },
          user: true,
        },
      });

      // Step 2: Filter out shops that have no products with numStock < 5
      const filteredShops = shops.filter(shop => shop.products.length > 0);

      console.log(filteredShops);
      const shopMessages = filteredShops.map(async (shop) => {
        const productMessages = shop.products.map(product => {
          return ` ${product.name} (stock of ${product.name} = ${product.numStock})`;
        });

        // Join all product messages into a single string for the shop
        const composedMessage = `Your shop "${shop.name}" has low stock of ${productMessages.join(', ')} . We will alert you when stock is less than 5.`;
        console.log(composedMessage);
        if (shop.user && shop.user.lineId) {
          console.log("sending line chat");
          let lineId = shop.user.lineId;
          const result = await strapi.service('api::hook-service.sms-service').sendMessage(lineId, composedMessage);
          console.log(result);
        }
        return composedMessage;
      });
    } catch (err) {
      ctx.body = err;
    }
  }
};
