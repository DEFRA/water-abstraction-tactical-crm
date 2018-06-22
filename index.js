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

if (process.env.DATABASE_URL) {
  // get heroku db params from env vars
  var workingVariable = process.env.DATABASE_URL.replace('postgres://', '');
  process.env.PGUSER = workingVariable.split('@')[0].split(':')[0];
  process.env.PGPASSWORD = workingVariable.split('@')[0].split(':')[1];
  process.env.PGHOST = workingVariable.split('@')[1].split(':')[0];
  process.env.PSPORT = workingVariable.split('@')[1].split(':')[1].split('/')[0];
  process.env.PGDATABASE = workingVariable.split('@')[1].split(':')[1].split('/')[1];
}

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

async function init () {
  await server.register({
    plugin: serverPlugins.good,
    options: {
      ...config.good,
      reporters: {
        winston: [goodWinstonStream]
      }
    }
  });

  await server.register({
    plugin: serverPlugins.blipp,
    options: config.blipp
  });

  await server.register({ plugin: serverPlugins.hapiAuthJwt2 });

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,          // Never Share your secret key
    validate: validateJWT,            // validate function defined above
    verifyOptions: {}, // pick a strong algorithm
    verify: validateJWT
  });

  server.auth.default('jwt');

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
