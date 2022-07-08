'use strict'
// default settings for lab test runs.
//
// This is overridden if arguments are passed to lab via the command line.
module.exports = {
  verbose: true,
  coverage: true,
  // Means when we use *.only() in our tests we just get the output for what we've flagged rather than all output but
  // greyed out to show it was skipped
  'silent-skips': true,
  // lcov reporter required for SonarCloud
  reporter: ['console', 'html', 'lcov'],
  // This version global seems to be introduced by sinon.
  globals: ['version', 'fetch', 'Response', 'Headers', 'Request', 'WeakRef', 'FinalizationRegistry'].joins(',')
};
