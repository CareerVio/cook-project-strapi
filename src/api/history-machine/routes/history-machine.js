module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/history-machine',
      handler: 'history-machine.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/history-machine',
      handler: 'history-machine.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
