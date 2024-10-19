module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/customapi/hello',
        handler: 'customapi.hello',
        config: {
          auth: false,  // Set this to true if you want authentication
          policies: [],
        },
      },
    ],
  };
  