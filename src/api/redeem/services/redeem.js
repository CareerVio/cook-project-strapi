'use strict';

/**
 * redeem service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::redeem.redeem');
