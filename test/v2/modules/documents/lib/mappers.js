const { experiment, test, beforeEach } = exports.lab = require('@hapi/lab').script();
const { expect } = require('@hapi/code');
const mappers = require('../../../../../src/v2/modules/documents/lib/mappers');

experiment('v2/modules/documents/lib/mappers', () => {
  experiment('camelCaseKeys', () => {
    test('converts object keys to camel case', async () => {
      const obj = {
        snake_case: 'foo',
        camelCase: 'bar'
      };
      const result = mappers.camelCaseKeys(obj);
      expect(result).to.equal({
        snakeCase: 'foo',
        camelCase: 'bar'
      });
    });
  });

  experiment('mapEntity', () => {
    const obj = {
      id: 1,
      field_a: 2,
      field_b: 3
    };

    test('only includes specified keys', async () => {
      const result = mappers.mapEntity(obj, ['id']);
      expect(Object.keys(result)).to.only.include(['id']);
    });

    test('converts object keys to camel case', async () => {
      const result = mappers.mapEntity(obj, ['id', 'field_a']);
      expect(Object.keys(result)).to.only.include(['id', 'fieldA']);
    });

    test('returns null if the id property is null', async () => {
      const result = mappers.mapEntity({ id: null }, ['id']);
      expect(result).to.equal(null);
    });
  });

  experiment('mapDocumentRole', () => {
    const row = {
      document_role_id: 'role_1',
      role_id: 'role_id_1',
      role_name: 'role_name',
      start_date: '2019-01-01',
      end_date: '2019-12-31',
      company_id: 'company_1',
      name: 'company',
      company_number: '12345',
      contact_id: 'contact_1',
      salutation: 'Dr',
      first_name: 'John',
      middle_names: 'A',
      last_name: 'Doe',
      address_id: 'address_1',
      address_1: 'Daisy cottage',
      address_2: 'Buttercup lane',
      address_3: 'Dandelion road',
      address_4: 'Poppy field',
      town: 'Testington',
      county: 'Testingshire',
      postcode: 'AB1 2CD',
      country: 'UK',
      invoice_account_id: 'invoice_account_1',
      invoice_account_number: 'A12345'
    };

    let result;

    beforeEach(async () => {
      result = mappers.mapDocumentRole(row);
    });

    test('object contains expected keys', async () => {
      const keys = Object.keys(result);
      expect(keys).to.only.include([
        'documentRoleId',
        'roleId',
        'roleName',
        'startDate',
        'endDate',
        'company',
        'contact',
        'address',
        'invoiceAccount']);
    });

    test('document role is mapped correctly', async () => {
      expect(result.documentRoleId).to.equal(row.document_role_id);
      expect(result.roleId).to.equal(row.role_id);
      expect(result.roleName).to.equal(row.role_name);
      expect(result.startDate).to.equal(row.start_date);
      expect(result.endDate).to.equal(row.end_date);
    });

    test('company is mapped correctly', async () => {
      expect(result.company).to.equal({
        companyId: 'company_1',
        name: 'company',
        companyNumber: '12345'
      });
    });

    test('contact is mapped correctly', async () => {
      expect(result.contact).to.equal({
        contactId: 'contact_1',
        salutation: 'Dr',
        firstName: 'John',
        lastName: 'Doe',
        middleNames: 'A'
      });
    });

    test('address is mapped correctly', async () => {
      expect(result.address).to.equal({
        addressId: 'address_1',
        address1: 'Daisy cottage',
        address2: 'Buttercup lane',
        address3: 'Dandelion road',
        address4: 'Poppy field',
        town: 'Testington',
        county: 'Testingshire',
        postcode: 'AB1 2CD',
        country: 'UK'
      });
    });

    test('invoice account is mapped correctly', async () => {
      expect(result.invoiceAccount).to.equal({
        invoiceAccountId: 'invoice_account_1',
        invoiceAccountNumber: 'A12345'
      });
    });
  });
});
