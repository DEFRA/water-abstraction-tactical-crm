'use strict'

const {
  experiment,
  test,
  beforeEach,
  afterEach
} = exports.lab = require('@hapi/lab').script()

const { expect } = require('@hapi/code')
const sandbox = require('sinon').createSandbox()
const { v4: uuid } = require('uuid')

const controller = require('../../../../src/v2/modules/companies/controller')
const companiesService = require('../../../../src/v2/services/companies')
const errors = require('../../../../src/v2/lib/errors')
const Company = require('../../../../src/v2/connectors/bookshelf/Company')

experiment('modules/companies/controller', () => {
  let h
  let created

  beforeEach(async () => {
    created = sandbox.spy()
    h = {
      response: sandbox.stub().returns({ created })
    }

    sandbox.stub(companiesService, 'getCompany')
    sandbox.stub(companiesService, 'createPerson')
    sandbox.stub(companiesService, 'createOrganisation')
    sandbox.stub(companiesService, 'addAddress')
    sandbox.stub(companiesService, 'addContact')
    sandbox.stub(companiesService, 'getAddresses')
    sandbox.stub(companiesService, 'getContacts')
    sandbox.stub(companiesService, 'getCompanyInvoiceAccounts')
    sandbox.stub(companiesService, 'patchCompanyContact')
    sandbox.stub(companiesService, 'searchCompaniesByName')
    sandbox.stub(companiesService, 'getCompanyLicences')
    sandbox.stub(companiesService, 'getCompanyWAAEmailContacts')
  })

  afterEach(async () => {
    sandbox.restore()
  })

  experiment('.getCompany', () => {
    let response
    let request

    beforeEach(async () => {
      request = {
        params: {
          companyId: uuid()
        }
      }

      companiesService.getCompany.resolves({
        companyId: request.params.companyId,
        name: 'test-company'
      })

      response = await controller.getCompany(request)
    })

    test('calls through to the service with the company id', async () => {
      const [id] = companiesService.getCompany.lastCall.args
      expect(id).to.equal(request.params.companyId)
    })

    test('return the found data', async () => {
      expect(response).to.equal({
        companyId: request.params.companyId,
        name: 'test-company'
      })
    })
  })

  experiment('.searchCompaniesByName', () => {
    let response
    let request
    let tempCompany

    beforeEach(async () => {
      request = {
        query: {
          name: 'test'
        }
      }

      tempCompany = new Company({
        name: request.query.name
      })

      companiesService.searchCompaniesByName.resolves([tempCompany])

      response = await controller.searchCompaniesByName(request)
    })

    test('calls through to the service with the company id', async () => {
      const [name] = companiesService.searchCompaniesByName.lastCall.args
      expect(name).to.equal('test')
    })

    test('return the found data', async () => {
      expect(response).to.equal([tempCompany])
    })
  })

  experiment('.postCompany', () => {
    beforeEach(async () => {
      companiesService.createPerson.resolves({
        companyId: 'test-person-id',
        type: 'person'
      })

      companiesService.createOrganisation.resolves({
        companyId: 'test-company-id',
        type: 'organisation'
      })
    })

    experiment('when creating a person', () => {
      beforeEach(async () => {
        await controller.postCompany({
          payload: {
            type: 'person',
            name: 'test-name',
            isTest: true
          }
        }, h)
      })

      test('calls the expected service function', async () => {
        const [name, isTest] = companiesService.createPerson.lastCall.args
        expect(name).to.equal('test-name')
        expect(isTest).to.equal(true)
      })

      test('returns the created entity in the response', async () => {
        const [result] = h.response.lastCall.args

        expect(result).to.equal({
          companyId: 'test-person-id',
          type: 'person'
        })
      })

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args
        expect(url).to.equal('/crm/2.0/companies/test-person-id')
      })
    })

    experiment('when creating an organisation', () => {
      beforeEach(async () => {
        await controller.postCompany({
          payload: {
            type: 'organisation',
            name: 'test-name',
            companyNumber: '123abc',
            organisationType: 'partnership',
            isTest: true
          }
        }, h)
      })

      test('calls the expected service function', async () => {
        const [name, companyNumber, organisationType, isTest] = companiesService.createOrganisation.lastCall.args
        expect(name).to.equal('test-name')
        expect(companyNumber).to.equal('123abc')
        expect(organisationType).to.equal('partnership')
        expect(isTest).to.equal(true)
      })

      test('returns the created entity in the response', async () => {
        const [result] = h.response.lastCall.args

        expect(result).to.equal({
          companyId: 'test-company-id',
          type: 'organisation'
        })
      })

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args
        expect(url).to.equal('/crm/2.0/companies/test-company-id')
      })
    })

    experiment('when there is an error', () => {
      let response
      const ERROR = new errors.EntityValidationError('oops!')

      beforeEach(async () => {
        companiesService.createPerson.rejects(ERROR)
        response = await controller.postCompany({
          payload: {
            type: 'person',
            name: 'test-name',
            isTest: true
          }
        }, h)
      })

      test('the error is mapped', async () => {
        expect(response.isBoom).to.be.true()
        expect(response.output.statusCode).to.equal(422)
      })
    })
  })

  experiment('.postCompanyAddress', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      },
      payload: {
        addressId: 'test-address-id',
        roleName: 'test-role-name',
        startDate: '2020-01-01',
        isTest: true
      }
    }

    beforeEach(async () => {
      companiesService.addAddress.resolves({
        companyAddressId: 'test-company-address-id'
      })
    })

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        await controller.postCompanyAddress(request, h)
      })

      test('the service is called with the right params', async () => {
        expect(companiesService.addAddress.calledWith(
          'test-company-id',
          'test-address-id',
          'test-role-name',
          {
            startDate: '2020-01-01'
          },
          true
        )).to.be.true()
      })

      test('returns the created company address in the response', async () => {
        const [result] = h.response.lastCall.args

        expect(result).to.equal({
          companyAddressId: 'test-company-address-id'
        })
      })

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args
        expect(url).to.equal('/crm/2.0/companies/test-company-id/addresses/test-company-address-id')
      })
    })

    experiment('when there is a unique constraint violation', () => {
      let response

      beforeEach(async () => {
        companiesService.addAddress.rejects(new errors.UniqueConstraintViolation())
        response = await controller.postCompanyAddress(request, h)
      })

      test('a Boom conflict error is returned', async () => {
        expect(response.isBoom).to.be.true()
        expect(response.output.statusCode).to.equal(409)
      })
    })

    experiment('when there is an unknown error', () => {
      beforeEach(async () => {
        companiesService.addAddress.rejects(new Error('oops'))
      })

      test('an error is thrown', async () => {
        const func = () => controller.postCompanyAddress(request, h)
        expect(func()).to.reject()
      })
    })
  })

  experiment('.postCompanyContact', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      },
      payload: {
        contactId: 'test-contact-id',
        roleName: 'test-role-name',
        startDate: '2020-01-01',
        isTest: true
      }
    }

    beforeEach(async () => {
      companiesService.addContact.resolves({
        companyContactId: 'test-company-contact-id'
      })
    })

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        await controller.postCompanyContact(request, h)
      })

      test('the service is called with the right params', async () => {
        expect(companiesService.addContact.calledWith(
          'test-company-id',
          'test-contact-id',
          'test-role-name',
          {
            startDate: '2020-01-01'
          },
          true
        )).to.be.true()
      })

      test('returns the created company contact in the response', async () => {
        const [result] = h.response.lastCall.args

        expect(result).to.equal({
          companyContactId: 'test-company-contact-id'
        })
      })

      test('returns a 201 response code', async () => {
        const [url] = created.lastCall.args
        expect(url).to.equal('/crm/2.0/companies/test-company-id/contacts/test-company-contact-id')
      })
    })

    experiment('when there is a unique constraint violation', () => {
      let response

      beforeEach(async () => {
        companiesService.addContact.rejects(new errors.UniqueConstraintViolation())
        response = await controller.postCompanyContact(request, h)
      })

      test('a Boom conflict error is returned', async () => {
        expect(response.name).to.equal('Error')
        expect(response.isBoom).to.be.true()
        expect(response.output.statusCode).to.equal(409)
        expect(response.message).to.equal('Conflict')
        expect(response.output.payload.error).to.equal('Conflict')
      })
    })

    experiment('when there is a foreign key constraint violation', () => {
      let response

      beforeEach(async () => {
        companiesService.addContact.rejects(new errors.ForeignKeyConstraintViolation())
        response = await controller.postCompanyContact(request, h)
      })

      test('a Boom conflict error is returned', async () => {
        expect(response.name).to.equal('Error')
        expect(response.isBoom).to.be.true()
        expect(response.output.statusCode).to.equal(409)
        expect(response.message).to.equal('Conflict')
        expect(response.output.payload.error).to.equal('Conflict')
      })
    })

    experiment('when there is an unknown error', () => {
      beforeEach(async () => {
        companiesService.addContact.rejects(new Error('oops'))
      })

      test('an error is thrown', async () => {
        const func = () => controller.postCompanyContact(request, h)
        expect(func()).to.reject()
      })
    })
  })

  experiment('.patchCompanyContact', () => {
    const request = {
      params: {
        companyId: 'test-company-id',
        contactId: 'test-contact-id'
      },
      payload: {
        roleName: 'test-role-name'
      }
    }

    beforeEach(async () => {
      companiesService.patchCompanyContact.resolves({
        companyContactId: 'test-company-contact-id'
      })
    })

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        await controller.patchCompanyContact(request, h)
      })

      test('the service is called with the right params', async () => {
        expect(companiesService.patchCompanyContact.calledWith(
          'test-company-id',
          'test-contact-id',
          {
            roleName: 'test-role-name'
          }
        )).to.be.true()
      })
    })

    experiment('when there is an unknown error', () => {
      beforeEach(async () => {
        companiesService.patchCompanyContact.rejects(new Error('oops'))
      })

      test('an error is thrown', async () => {
        const func = () => controller.patchCompanyContact(request, h)
        expect(func()).to.reject()
      })
    })
  })

  experiment('.getCompanyAddresses', () => {
    let result
    const request = {
      method: 'get',
      params: {
        companyId: 'test-company-id'
      }
    }

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        companiesService.getAddresses.resolves([{
          companyAddressId: 'test-company-address-1'
        }])
        result = await controller.getCompanyAddresses(request)
      })

      test('the service method .getAddresses is called with the correct ID', async () => {
        expect(companiesService.getAddresses.calledWith(
          request.params.companyId
        )).to.be.true()
      })

      test('the company addresses are returned with no envelope', async () => {
        expect(result[0].companyAddressId).to.equal('test-company-address-1')
      })
    })

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        companiesService.getAddresses.rejects(new errors.NotFoundError('Company not found'))
        result = await controller.getCompanyAddresses(request)
      })

      test('the controller resolves with a Boom 404', async () => {
        expect(result.isBoom).to.be.true()
        expect(result.output.statusCode).to.equal(404)
      })
    })
  })

  experiment('.getCompanyContacts', () => {
    let result
    const request = {
      method: 'get',
      params: {
        companyId: 'test-company-id'
      }
    }

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        companiesService.getContacts.resolves([{
          companyContactId: 'test-company-contact-1'
        }])
        result = await controller.getCompanyContacts(request)
      })

      test('the service method .getContacts is called with the correct ID', async () => {
        expect(companiesService.getContacts.calledWith(
          request.params.companyId
        )).to.be.true()
      })

      test('the company contacts are returned with no envelope', async () => {
        expect(result[0].companyContactId).to.equal('test-company-contact-1')
      })
    })

    experiment('when the company is not found', () => {
      beforeEach(async () => {
        companiesService.getContacts.rejects(new errors.NotFoundError('Company not found'))
        result = await controller.getCompanyContacts(request)
      })

      test('the controller resolves with a Boom 404', async () => {
        expect(result.isBoom).to.be.true()
        expect(result.output.statusCode).to.equal(404)
      })
    })
  })

  experiment('getCompanyInvoiceAccounts', () => {
    let result
    const request = {
      params: {
        companyId: 'test-company-id'
      }
    }

    const invoiceAccountsExampleResponse = {
      id: uuid(),
      accountNumber: 'X000000X',
      company: {
        id: request.params.companyId
      }
    }

    experiment('when there are no errors', () => {
      beforeEach(async () => {
        companiesService.getCompanyInvoiceAccounts.resolves([invoiceAccountsExampleResponse])
        result = await controller.getCompanyInvoiceAccounts(request)
      })

      test('the service method .getCompanyInvoiceAccounts is called with the correct ID', async () => {
        expect(companiesService.getCompanyInvoiceAccounts.calledWith(
          request.params.companyId
        )).to.be.true()
      })

      test('the returned array of objects belong to that company', async () => {
        expect(result[0].company.id).to.equal('test-company-id')
      })
    })
  })

  experiment('getCompanyLicences', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      }
    }

    beforeEach(async () => {
      await controller.getCompanyLicences(request)
    })

    test('the service method .getCompanyLicences is called with the correct ID', async () => {
      expect(companiesService.getCompanyLicences.calledWith(
        request.params.companyId
      )).to.be.true()
    })
  })

  experiment('getCompanyWAAEmailContacts', () => {
    const request = {
      params: {
        companyId: 'test-company-id'
      }
    }

    beforeEach(async () => {
      await controller.getCompanyWAAEmailContacts(request)
    })

    test('the service method .getCompanyLicences is called with the correct ID', async () => {
      expect(companiesService.getCompanyWAAEmailContacts.calledWith(
        request.params.companyId
      )).to.be.true()
    })
  })
})
