module.exports = {
  version: '1.0',

  logger: {
    level: 'info',
    airbrakeKey: process.env.errbit_key,
    airbrakeHost: process.env.errbit_server,
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
    port: process.env.PORT || 8002
  },

  blipp: {
    showAuth: true
  },

  pg: {
    connectionString: process.env.DATABASE_URL,
    max: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
  }
};
