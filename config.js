'use strict'

// TODO: Figure out why we need this for the tests to pass!
require('dotenv').config()

const environment = process.env.ENVIRONMENT
const isProduction = environment === 'prd'

module.exports = {
  version: '1.0',

  logger: {
    level: process.env.WRLS_LOG_LEVEL || 'info',
    airbrakeKey: process.env.ERRBIT_KEY,
    airbrakeHost: process.env.ERRBIT_SERVER,
    airbrakeLevel: 'error'
  },

  good: {
    ops: {
      interval: 10000
    }
  },

  server: {
    router: {
      stripTrailingSlash: true
    },
    port: 8002
  },

  blipp: {
    showAuth: true
  },

  pg: {
    connectionString: process.env.DATABASE_URL,
    max: 7
  },

  isProduction
}
