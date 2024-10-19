module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/getProfile',
      handler: 'rvm-api.getProfile',
      config: {
        auth: false,  // Set this to true if authentication is needed
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/calculatedBottlePoints',
      handler: 'rvm-api.calculatedBottlePoints',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/calculatedCanPoints',
      handler: 'rvm-api.calculatedCanPoints',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/accumulatePoints',
      handler: 'rvm-api.accumulatePoints',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/donate',
      handler: 'rvm-api.donate',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/activate',
      handler: 'rvm-api.activate',
      config: {
        auth: false,
        policies: [],
      },
    },
    {
      method: 'POST',
      path: '/heartbeat',
      handler: 'rvm-api.heartbeat',
      config: {
        auth: false,
        policies: [],
      },
    },
  ],
};

  