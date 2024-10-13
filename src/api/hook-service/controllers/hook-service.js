'use strict';

/**
 * A set of functions called "actions" for `hook-service`
 */

module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      const userId = 'U701f0f485dcbb1255353f409b100c8fc'; // The recipient's user ID
      const message = 'Hello! Oak Oak 2';
      const result = await strapi.service('api::hook-service.sms-service').sendMessage(userId, message);

      ctx.body = result;
    } catch (err) {
      ctx.body = err;
    }
  },
  hookAction: async (ctx, next) => {
    try {
      // const result = await strapi.service('api::hook-service.sms-service').sendMessage(userId, message);
      const body = ctx.request.body;
      console.log("body");
      console.log(body);
      
      if (body.event === "entry.update" && body.model === "product" && body.entry.approved) {
        const entry = body.entry;
        const product = await strapi.entityService.findOne('api::product.product',
          body.entry.id,
          {
            populate: [
              "shop", "shop.user"
            ],
          });
          console.log("product");
          console.log(product);
          let lineId = product.shop.user.lineId;
          let message = `สินค้า ${entry.name} ได้รับการอนุมัติแล้ว`;
          const result = await strapi.service('api::hook-service.sms-service').sendMessage(lineId, message);


      }else if (body.event === "entry.update" && body.model === "invoice" && body.entry.status === "paid") {
        const entry = body.entry;
        const invoice = await strapi.entityService.findOne('api::invoice.invoice',
          body.entry.id,
          {
            populate: [
              "shop", "shop.user"
            ],
          });
          console.log("invoice");
          console.log(invoice);
          let lineId = invoice.shop.user.lineId;
          let message = `Invoice Id = ${body.entry.id} ได้รับการชำระเงินแล้ว`;
          const result = await strapi.service('api::hook-service.sms-service').sendMessage(lineId, message);

      }
      ctx.body = "OKKKK";
    } catch (err) {
      console.log(err);
      ctx.body = err;
    }
  }
};
