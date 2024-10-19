'use strict';

/**
 * cabinet-status service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cabinet-status.cabinet-status');
