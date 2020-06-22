const { find, omit, get } = require('lodash');

const currentAddressOnly = invoiceAccount => {
  const invoiceAccountAddress = find(invoiceAccount.invoiceAccountAddresses,
    invoiceAccountAddress => invoiceAccountAddress.endDate === null
  );
  const address = get(invoiceAccountAddress, 'address', null);
  const agentCompany = get(invoiceAccountAddress, 'agentCompany', null);
  const contact = get(invoiceAccountAddress, 'contact', null);

  return {
    ...omit(invoiceAccount, 'invoiceAccountAddresses'),
    address,
    agentCompany,
    contact
  };
};

exports.currentAddressOnly = currentAddressOnly;
