# Water Abstraction Tactical CRM

![Build Status](https://github.com/DEFRA/water-abstraction-tactical-crm/workflows/CI/badge.svg?branch=develop)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-tactical-crm&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-tactical-crm)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=DEFRA_water-abstraction-tactical-crm&metric=coverage)](https://sonarcloud.io/dashboard?id=DEFRA_water-abstraction-tactical-crm)
[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/water-abstraction-tactical-crm/badge.svg)](https://snyk.io/test/github/DEFRA/water-abstraction-tactical-crm)
[![Licence](https://img.shields.io/badge/Licence-OGLv3-blue.svg)](http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3)

This component is one of 3 that combine to give you the ability to store a document or details of a permit or pass, to link those documents to users that can view and be able to have different access for internal and external users. With a front end it will enable most processes to capture, share and view details of permits and or licence style information

__Permit Repository:__ <https://github.com/DEFRA/water-abstraction-permit-repository>

__IDM:__ <https://github.com/DEFRA/water-abstraction-tactical-idm>

__CRM:__ <https://github.com/DEFRA/water-abstraction-tactical-crm>

The tactical CRM is a lightweight CRM solution providing a means of managing:

* __Entities__
  * __Individuals__ - a person who may have one or more roles enabling them to view documents within one or many organisations
  * __Organisations__ - a business or organisation that has one or more documents
  * __Regimes__ - a high level means of grouping documents, e.g. ‘Water’ or ‘Waste’
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

## Environment Variables

The required environment variables for local development can be found in the [.env.example file](./.env.example).
