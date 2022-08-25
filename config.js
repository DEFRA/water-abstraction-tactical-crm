'use strict'

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
    max: process.env.NODE_ENV === 'local' ? 20 : 7
  },

  isProduction
}
