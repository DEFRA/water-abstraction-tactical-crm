// default settings for lab test runs.
//
// This is overridden if arguments are passed to lab via the command line.
module.exports = {
  // This version global seems to be introduced by sinon.
  globals: 'version,fetch,Response,Headers,Request',
  verbose: true,

  'coverage-exclude': [
    'migrations',
    'node_modules',
    'scripts',
    'test',
    'src/lib/logger'
  ]
};
