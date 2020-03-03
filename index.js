'use strict';

require('dotenv').config();

const GoodWinston = require('good-winston');
const Hapi = require('@hapi/hapi');

const config = require('./config');
const db = require('./src/lib/connectors/db');
const { logger } = require('./src/logger');
const goodWinstonStream = new GoodWinston({ winston: logger });

const serverPlugins = {
  blipp: require('blipp'),
  hapiAuthJwt2: require('hapi-auth-jwt2'),
  good: require('@hapi/good')
};

const server = new Hapi.Server(config.server);

function validateJWT (decoded, request, h) {
  request.log('debug', `validate JWT at ${request.path} with payload:`);
  request.log('debug', request.payload);
  request.log('debug', 'decodes as: ');
  request.log('debug', decoded);

  const isValid = !!decoded.id;
  const message = isValid ? 'huzah... JWT OK' : 'boo... JWT failed';
  request.log('debug', message);
  return { isValid };
}

const initGood = async () => {
  await server.register({
    plugin: serverPlugins.good,
    options: {
      ...config.good,
      reporters: {
        winston: [goodWinstonStream]
      }
    }
  });
};

const initBlipp = async () => {
  await server.register({
    plugin: serverPlugins.blipp,
    options: config.blipp
  });
};

const configureJwtStrategy = () => {
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET, // Never Share your secret key
    validate: validateJWT, // validate function defined above
    verifyOptions: {}, // pick a strong algorithm
    verify: validateJWT
  });

  server.auth.default('jwt');
};

async function init () {
  await initGood();
  await initBlipp();

  await server.register({ plugin: serverPlugins.hapiAuthJwt2 });

  configureJwtStrategy();

  // load routes
  server.route(require('./src/routes/crm'));
  server.route(require('./src/v2/routes'));

  if (!module.parent) {
    await server.start();
    const name = process.env.SERVICE_NAME;
    const uri = server.info.uri;
    server.log('info', `Service ${name} running at: ${uri}`);
  }
}

const processError = message => err => {
  logger.error(message, err);
  process.exit(1);
};

process
  .on('unhandledRejection', processError('unhandledRejection'))
  .on('uncaughtException', processError('uncaughtException'))
  .on('SIGINT', async () => {
    logger.info('Stopping CRM service');

    await server.stop();
    logger.info('1/2: Hapi server stopped');

    await db.pool.end();
    logger.info('2/2: Connection pool closed');

    return process.exit(0);
  });

init();

module.exports = server;
