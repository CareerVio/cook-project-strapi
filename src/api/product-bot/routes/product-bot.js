module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/product-bot',
     handler: 'product-bot.checkStockAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
