const { find, omit, get } = require('lodash');

const currentAddressOnly = invoiceAccount => {
  const invoiceAccountAddress = find(invoiceAccount.invoiceAccountAddresses,
    invoiceAccountAddress => invoiceAccountAddress.endDate === null
  );
  const address = get(invoiceAccountAddress, 'address', null);
  return {
    ...omit(invoiceAccount, 'invoiceAccountAddresses'),
    address
  };
};

exports.currentAddressOnly = currentAddressOnly;
