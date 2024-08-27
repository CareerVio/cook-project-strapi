'use strict';

/**
 * oil-machine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::oil-machine.oil-machine');
