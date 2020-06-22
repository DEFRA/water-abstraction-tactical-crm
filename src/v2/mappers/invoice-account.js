// const { find, omit, get } = require('lodash');
const moment = require('moment');
const { sortBy } = require('lodash');

const getStartDateTimestamp = invoiceAccountAddress => moment(invoiceAccountAddress.startDate).unix();

const mostRecentAddressOnly = invoiceAccount => {
  const sortedAddresses = sortBy(invoiceAccount.invoiceAccountAddresses, getStartDateTimestamp);

  return {
    ...invoiceAccount,
    invoiceAccountAddresses: sortedAddresses.slice(-1)
  };
};

exports.mostRecentAddressOnly = mostRecentAddressOnly;
