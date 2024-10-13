module.exports = {
  routes: [
    {
     method: 'POST',
     path: '/hook-service',
     handler: 'hook-service.hookAction',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
