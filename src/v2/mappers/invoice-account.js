const moment = require('moment')

const getStartDateTimestamp = invoiceAccountAddress => moment(invoiceAccountAddress.startDate).unix()

const mostRecentAddressOnly = invoiceAccount => {
  const sortedAddresses = invoiceAccount.invoiceAccountAddresses.sort((startDate1, startDate2) => {
    if ((startDate1, getStartDateTimestamp) > (startDate2, getStartDateTimestamp)) {
      return -1
    } else {
      return 1
    }
  })

  return {
    ...invoiceAccount,
    invoiceAccountAddresses: sortedAddresses.slice(-1)
  }
}

exports.mostRecentAddressOnly = mostRecentAddressOnly
