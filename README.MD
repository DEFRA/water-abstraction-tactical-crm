[![Build Status](https://travis-ci.org/DEFRA/water-abstraction-tactical-crm.svg?branch=master)](https://travis-ci.org/DEFRA/water-abstraction-tactical-crm)

# Introduction
This component is one of 3 that combine to give you the ability to store a document or details of a permit or pass, to link those documents to users that can view and be able to have different access for internal and external users. With a front end it will enable most processes to capture, share and view details of permits and or licence style information

__Permit Repository:__ https://github.com/DEFRA/water-abstraction-permit-repository

__IDM:__ https://github.com/DEFRA/water-abstraction-tactical-idm

__CRM:__ https://github.com/DEFRA/water-abstraction-tactical-crm


# water-abstraction-tactical-crm
[![Maintainability](https://api.codeclimate.com/v1/badges/eeadf60a5df1e504f286/maintainability)](https://codeclimate.com/github/DEFRA/water-abstraction-tactical-crm/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/eeadf60a5df1e504f286/test_coverage)](https://codeclimate.com/github/DEFRA/water-abstraction-tactical-crm/test_coverage)

The tactical CRM is a lightweight CRM solution providing a means of managing:

* __Entities__
    - __Individuals__ - a person who may have one or more roles enabling them to view documents within one or many organisations  
    - __Organisations__ - a business or organisation that has one or more documents
    - __Regimes__ - a high level means of grouping documents, e.g. ‘Water’ or ‘Waste’
* __Documents__ - references documents such as licences or permits for a particular organisation (these may be stored in the permit repository or other systems)
* __Roles__ - manages the relationship of individuals to an organisation and regime
* __Verifications__ - facilitates the process of a user verifying they have permission to access a particular organisation’s documents

The tactical CRM is developed in HAPI/NodeJS and backed by a Postgres SQL database.  All data is transferred via a REST API with JWT authentication.

The REST API supports basic filtering and pagination operations on all endpoints.

Implementation of user interfaces, IDM, and permit data storage is left open to the specific use case requirements.

## Deployment

See water-abstraction/deploy-script on internal gitlab for deployment instructions

## Development Team

This module was developed by the Water Resource Licensing Service team as part of a digital transformation project at [DEFRA](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs), a department of the UK government

To find out more about planned reforms to the abstraction licensing service, see the policy paper: [Water abstraction plan: Abstraction licensing service](https://www.gov.uk/government/publications/water-abstraction-plan-2017/water-abstraction-plan-abstraction-licensing-service)

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.

All contributions should be submitted via a pull request.

## License

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the license

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.

