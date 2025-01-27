'use strict'

// TODO: Figure out why we need this for the tests to pass!
require('dotenv').config()

const environment = process.env.ENVIRONMENT
const isProduction = environment === 'prd'

module.exports = {
  version: '1.0',

  // This config is specifically for hapi-pino which was added to replace the deprecated (and noisy!) hapi/good. At
  // some point all logging would go through this. But for now, it just covers requests & responses
  log: {
    // Credit to https://stackoverflow.com/a/323546/6117745 for how to handle
    // converting the env var to a boolean
    logInTest: (String(process.env.LOG_IN_TEST) === 'true') || false,
    level: process.env.WRLS_LOG_LEVEL || 'warn'
  },

  // This config is used by water-abstraction-helpers and its use of Winston and Airbrake. Any use of `logger.info()`,
  // for example, is built on this config.
  logger: {
    level: process.env.WRLS_LOG_LEVEL || 'warn',
    airbrakeKey: process.env.ERRBIT_KEY,
    airbrakeHost: process.env.ERRBIT_SERVER,
    airbrakeLevel: 'error'
  },

  server: {
    router: {
      stripTrailingSlash: true
    },
    port: 8002
  },

  pg: {
    connectionString: process.env.DATABASE_URL,
    max: 7
  },

  isProduction
}
