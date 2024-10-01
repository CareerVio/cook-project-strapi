module.exports = {
  routes: [
    // {
    //   method: 'POST',
    //   path: '/history-point',
    //   handler: 'history-point.create',
    //   config: {
    //     policies: [],
    //     middlewares: [],
    //   },
    // },
    {
      method: 'GET',
      path: '/history-point',
      handler: 'history-point.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
