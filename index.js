// Provides tactical CRM API
require('dotenv').config();

const GoodWinston = require('good-winston');
const Hapi = require('hapi');

const config = require('./config');
const logger = require('./src/lib/logger');

const goodWinstonStream = new GoodWinston({ winston: logger });
logger.init(config.logger);

const serverPlugins = {
  blipp: require('blipp'),
  hapiAuthJwt2: require('hapi-auth-jwt2'),
  good: require('good')
};

const server = new Hapi.Server(config.server);

const cacheKey = process.env.cacheKey || 'super-secret-cookie-encryption-key';
console.log('Cache key' + cacheKey);

function validateJWT (decoded, request, h) {
  console.log(`validate JWT at ${request.url.path} with payload:`);
  console.log(request.payload);
  console.log(`decodes as: `);
  console.log(decoded);

  const isValid = !!decoded.id;
  const message = isValid ? 'huzah... JWT OK' : 'boo... JWT failed';
  console.log(message);
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
    key: process.env.JWT_SECRET,  // Never Share your secret key
    validate: validateJWT,        // validate function defined above
    verifyOptions: {},            // pick a strong algorithm
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

  if (!module.parent) {
    await server.start();
    const name = process.env.servicename;
    const uri = server.info.uri;
    console.log(`Service ${name} running at: ${uri}`);
  }
}

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

init();

module.exports = server;
