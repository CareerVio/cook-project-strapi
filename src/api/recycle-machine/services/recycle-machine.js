'use strict';

/**
 * recycle-machine service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recycle-machine.recycle-machine');
