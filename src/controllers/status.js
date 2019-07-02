const pkg = require('../../package.json');
const { pick } = require('lodash');

const statusResponse = pick(pkg, 'version');

const getStatus = () => statusResponse;

exports.getStatus = getStatus;
