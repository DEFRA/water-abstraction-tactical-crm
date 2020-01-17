const testMode = parseInt(process.env.TEST_MODE) === 1;
const isAcceptanceTestTarget = ['local', 'dev', 'development', 'test', 'preprod'].includes(process.env.NODE_ENV);

module.exports = {
  version: '1.0',

  logger: {
    level: testMode ? 'info' : 'error',
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

  // Database has 125 available connections
  //
  // Outside of development each process runs on 2 instances on 2 cores.
  // So there will be 4 connection pools per service but just 1 locally
  //
  // Allocations:
  //
  // | ----------------------------------- | --------------- | --------------- |
  // | Service                             | Local Dev Count | Non local count |
  // | ----------------------------------- | --------------- | --------------- |
  // | water-abstraction-import            |              16 |               4 |
  // | water-abstraction-permit-repository |              12 |               3 |
  // | water-abstraction-returns           |              16 |               4 |
  // | water-abstraction-service           |              40 |              10 |
  // | water-abstraction-tactical-crm      |              20 |               5 |
  // | water-abstraction-tactical-idm      |              20 |               5 |
  // | ----------------------------------- | --------------- | --------------- |
  // | TOTAL                               |             124 |              31 |
  // | ----------------------------------- | --------------- | --------------- |
  //
  pg: {
    connectionString: process.env.DATABASE_URL,
    max: process.env.NODE_ENV === 'local' ? 20 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  },

  isAcceptanceTestTarget
};
