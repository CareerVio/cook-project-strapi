// extensions/users-permissions/controllers/Auth.js
// const { sanitizeEntity } = require('strapi-utils');

// module.exports = {
//   async register(ctx) {
//     const { username, password } = ctx.request.body;

//     if (!username || !password) {
//       return ctx.badRequest('Username and password are required');
//     }

//     // Check if the user already exists
//     const existingUser = await strapi.query('user', 'users-permissions').findOne({ username });

//     if (existingUser) {
//       return ctx.badRequest('Username already taken');
//     }

//     // Create the new user
//     const newUser = await strapi.query('user', 'users-permissions').create({
//       username,
//       password,
//       provider: 'local',
//       confirmed: true,  // Automatically confirm the user
//     });

//     // Generate JWT token
//     const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: newUser.id });

//     return ctx.send({
//       jwt,
//       user: sanitizeEntity(newUser, { model: strapi.query('user', 'users-permissions').model }),
//     });
//   },
// };
