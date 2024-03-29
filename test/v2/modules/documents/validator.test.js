'use strict'

const {
  experiment,
  test,
  beforeEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')

const validator = require('../../../../src/v2/modules/documents/validator')
const { v4: uuid } = require('uuid')

const documentValidator = require('../../../../src/v2/modules/documents/validator')

experiment('modules/documents/validator', () => {
  let document

  beforeEach(async () => {
    document = {
      regime: 'water',
      documentType: 'abstraction_licence',
      documentRef: 'doc-ref',
      startDate: '2001-01-18',
      endDate: '2010-01-17',
      isTest: true
    }
  })

  experiment('.validate', () => {
    experiment('regime', () => {
      test('is required', async () => {
        delete document.regime
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('cannot equal an empty string', async () => {
        document.regime = ''
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('has to equal water', async () => {
        document.regime = 'nothing'
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('has to equal water', async () => {
        document.regime = 'water'
        const { error } = validator.validateDocument(document)
        expect(error).to.be.undefined()
      })
    })

    experiment('documentType', () => {
      test('is required', async () => {
        delete document.documentType
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('cannot equal an empty string', async () => {
        document.documentType = ''
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('has to equal abstraction_licence', async () => {
        document.documentType = 'nothing'
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('has to equal abstraction_licence', async () => {
        document.documentType = 'abstraction_licence'
        const { error } = validator.validateDocument(document)
        expect(error).to.be.undefined()
      })
    })

    experiment('documentRef', () => {
      test('is required', async () => {
        delete document.documentRef
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('cannot equal an empty string', async () => {
        document.documentRef = ''
        const { error } = validator.validateDocument(document)
        expect(error).to.not.be.undefined()
      })

      test('has to equal abstraction_licence', async () => {
        document.documentRef = 'doc-ref'
        const { error } = validator.validateDocument(document)
        expect(error).to.be.undefined()
      })
    })
  })

  experiment('isTest', () => {
    test('can be omitted', async () => {
      delete document.isTest
      const { error } = validator.validateDocument(document)
      expect(error).to.be.undefined()
    })

    test('defaults to false', async () => {
      delete document.isTest
      const { value } = validator.validateDocument(document)
      expect(value.isTest).to.equal(false)
    })

    test('can be set', async () => {
      const { error, value } = validator.validateDocument(document)
      expect(error).to.be.undefined()
      expect(value.isTest).to.equal(true)
    })

    test('cannt be a string', async () => {
      document.isTest = 'yep'
      const { error } = validator.validateDocument(document)
      expect(error).to.not.be.undefined()
    })
  })

  experiment('.validateDocumentRole', () => {
    let fullBillingDocumentRole
    let fullLicenceHolderDocumentRole

    beforeEach(async () => {
      fullBillingDocumentRole = {
        documentId: uuid(),
        role: 'billing',
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        invoiceAccountId: uuid(),
        isTest: true
      }

      fullLicenceHolderDocumentRole = {
        documentId: uuid(),
        role: 'licenceHolder',
        companyId: uuid(),
        contactId: uuid(),
        addressId: uuid(),
        startDate: '2020-01-01',
        endDate: '2021-01-01',
        isTest: true
      }
    })

    experiment('.validateDocumentRole', () => {
      experiment('when the role is billing', () => {
        experiment('documentId', () => {
          test('is valid when a uuid', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.documentId).to.equal(fullBillingDocumentRole.documentId)
          })

          test('cannot be set to null', async () => {
            fullBillingDocumentRole.documentId = null
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('cannot be omitted', async () => {
            delete fullBillingDocumentRole.documentId
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullBillingDocumentRole.documentId = 123
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullBillingDocumentRole.documentId = ''
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('startDate', () => {
          test('is required', async () => {
            delete fullBillingDocumentRole.startDate
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is accepted in the correct format', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.startDate).to.equal(new Date(2020, 0, 1))
          })

          test('rejected if the date format is unexpected', async () => {
            fullBillingDocumentRole.startDate = '01/01/2000'
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('endDate', () => {
          test('is optional', async () => {
            delete fullBillingDocumentRole.endDate
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be null', async () => {
            fullBillingDocumentRole.endDate = null
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.endDate).to.equal(null)
          })

          test('is accepted in the correct format', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.endDate).to.equal(new Date(2021, 0, 1))
          })

          test('rejected if before the start date', async () => {
            fullBillingDocumentRole.startDate = '2000-02-01'
            fullBillingDocumentRole.endDate = '2000-01-01'
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('rejected if the date format is unexpected', async () => {
            fullBillingDocumentRole.endDate = '01/01/2000'
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('companyId', () => {
          test('can be omitted', async () => {
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be set to null', async () => {
            fullBillingDocumentRole.companyId = null
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.companyId).to.equal(null)
          })

          test('cannot be set to a uuid', async () => {
            fullBillingDocumentRole.companyId = uuid()
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullBillingDocumentRole.companyId = 123
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullBillingDocumentRole.companyId = ''
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('contactId', () => {
          test('can be omitted', async () => {
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be set to null', async () => {
            fullBillingDocumentRole.contactId = null
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.contactId).to.equal(null)
          })

          test('cannot be set to a uuid', async () => {
            fullBillingDocumentRole.companyId = uuid()
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullBillingDocumentRole.contactId = 123
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullBillingDocumentRole.contactId = ''
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('addressId', () => {
          test('can be omitted', async () => {
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be set to null', async () => {
            fullBillingDocumentRole.addressId = null
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.addressId).to.equal(null)
          })

          test('cannot be set to a uuid', async () => {
            fullBillingDocumentRole.companyId = uuid()
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullBillingDocumentRole.addressId = 123
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullBillingDocumentRole.addressId = ''
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('invoiceAccountId', () => {
          test('is valid when a uuid', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.invoiceAccountId).to.equal(fullBillingDocumentRole.invoiceAccountId)
          })

          test('cannot be set to null', async () => {
            fullBillingDocumentRole.invoiceAccountId = null
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('cannot be omitted', async () => {
            delete fullBillingDocumentRole.invoiceAccountId
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullBillingDocumentRole.invoiceAccountId = 123
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullBillingDocumentRole.invoiceAccountId = ''
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('isTest', () => {
          test('is optional and defaults to false', async () => {
            delete fullBillingDocumentRole.isTest
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.isTest).to.equal(false)
          })

          test('can be set to true', async () => {
            fullBillingDocumentRole.isTest = true
            const { error, value } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.be.undefined()
            expect(value.isTest).to.equal(true)
          })

          test('rejects non boolean', async () => {
            fullBillingDocumentRole.isTest = 'carrots'
            const { error } = documentValidator.validateDocumentRole(fullBillingDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })
      })

      experiment('when the role is licenceHolder', () => {
        experiment('documentId', () => {
          test('is valid when a uuid', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.documentId).to.equal(fullLicenceHolderDocumentRole.documentId)
          })

          test('cannot be set to null', async () => {
            fullLicenceHolderDocumentRole.documentId = null
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('cannot be omitted', async () => {
            delete fullLicenceHolderDocumentRole.documentId
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullLicenceHolderDocumentRole.documentId = 123
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullLicenceHolderDocumentRole.documentId = ''
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('startDate', () => {
          test('is required', async () => {
            delete fullLicenceHolderDocumentRole.startDate
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is accepted in the correct format', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.startDate).to.equal(new Date(2020, 0, 1))
          })

          test('rejected if the date format is unexpected', async () => {
            fullLicenceHolderDocumentRole.startDate = '01/01/2000'
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('endDate', () => {
          test('is optional', async () => {
            delete fullLicenceHolderDocumentRole.endDate
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be null', async () => {
            fullLicenceHolderDocumentRole.endDate = null
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.endDate).to.equal(null)
          })

          test('is accepted in the correct format', async () => {
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.endDate).to.equal(new Date(2021, 0, 1))
          })

          test('rejected if before the start date', async () => {
            fullLicenceHolderDocumentRole.startDate = '2000-02-01'
            fullLicenceHolderDocumentRole.endDate = '2000-01-01'
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('rejected if the date format is unexpected', async () => {
            fullLicenceHolderDocumentRole.endDate = '01/01/2000'
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('companyId', () => {
          test('is required', async () => {
            delete fullLicenceHolderDocumentRole.companyId
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('cannot be set to null', async () => {
            fullLicenceHolderDocumentRole.companyId = null
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('can be set to a uuid', async () => {
            fullLicenceHolderDocumentRole.companyId = uuid()
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.companyId).to.equal(fullLicenceHolderDocumentRole.companyId)
          })

          test('is not valid for a number', async () => {
            fullLicenceHolderDocumentRole.companyId = 123
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullLicenceHolderDocumentRole.companyId = ''
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('contactId', () => {
          test('is optional', async () => {
            delete fullLicenceHolderDocumentRole.contactId
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be set to null', async () => {
            fullLicenceHolderDocumentRole.contactId = null
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be set to a uuid', async () => {
            fullLicenceHolderDocumentRole.contactId = uuid()
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.contactId).to.equal(fullLicenceHolderDocumentRole.contactId)
          })

          test('is not valid for a number', async () => {
            fullLicenceHolderDocumentRole.contactId = 123
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullLicenceHolderDocumentRole.contactId = ''
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('addressId', () => {
          test('is required', async () => {
            delete fullLicenceHolderDocumentRole.addressId
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('cannot be set to null', async () => {
            fullLicenceHolderDocumentRole.addressId = null
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('can be set to a uuid', async () => {
            fullLicenceHolderDocumentRole.addressId = uuid()
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.addressId).to.equal(fullLicenceHolderDocumentRole.addressId)
          })

          test('is not valid for a number', async () => {
            fullLicenceHolderDocumentRole.addressId = 123
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullLicenceHolderDocumentRole.addressId = ''
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('invoiceAccountId', () => {
          test('cannot be set to a uuid', async () => {
            fullLicenceHolderDocumentRole.invoiceAccountId = uuid()
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('can be set to null', async () => {
            fullLicenceHolderDocumentRole.invoiceAccountId = null
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
          })

          test('can be omitted', async () => {
            delete fullLicenceHolderDocumentRole.invoiceAccountId
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
          })

          test('is not valid for a number', async () => {
            fullLicenceHolderDocumentRole.addressId = 123
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })

          test('is not valid for an empty string', async () => {
            fullLicenceHolderDocumentRole.invoiceAccountId = ''
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })

        experiment('isTest', () => {
          test('is optional and defaults to false', async () => {
            delete fullLicenceHolderDocumentRole.isTest
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.isTest).to.equal(false)
          })

          test('can be set to true', async () => {
            fullLicenceHolderDocumentRole.isTest = true
            const { error, value } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.be.undefined()
            expect(value.isTest).to.equal(true)
          })

          test('rejects non boolean', async () => {
            fullLicenceHolderDocumentRole.isTest = 'carrots'
            const { error } = documentValidator.validateDocumentRole(fullLicenceHolderDocumentRole)
            expect(error).to.not.be.undefined()
          })
        })
      })
    })
  })
})
