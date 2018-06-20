// Provides tactical CRM API
require('dotenv').config();

const GoodWinston = require('good-winston');
const Hapi = require('hapi');

const logger = require('./src/lib/logger');

logger.init({
  level: 'info',
  airbrakeKey: process.env.errbit_key,
  airbrakeHost: process.env.errbit_server,
  airbrakeLevel: 'error'
});

const goodWinstonStream = new GoodWinston({ winston: logger });

const goodOptions = {
  ops: {
    interval: 10000
  },
  reporters: {
    winston: [goodWinstonStream]
  }
};

const serverPlugins = {
  yar: require('yar'),
  blipp: require('blipp'),
  hapiAuthJwt2: require('hapi-auth-jwt2'),
  good: require('good')
};

const serverOptions = {
  router: { stripTrailingSlash: true },
  port: process.env.PORT || 8002
};
const server = new Hapi.Server(serverOptions);

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

// isSecure = true for live...
const yarOptions = {
  storeBlank: false,
  cookieOptions: {
    password: 'the-password-must-be-at-least-32-characters-long',
    isSecure: false
  }
};

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
    plugin: serverPlugins.yar,
    options: yarOptions
  });

  await server.register({
    plugin: serverPlugins.good,
    options: goodOptions
  });

  await server.register({
    plugin: serverPlugins.blipp,
    options: { showAuth: true }
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
