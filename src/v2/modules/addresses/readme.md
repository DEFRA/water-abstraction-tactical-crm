# Addresses

The CRM must handle both addresses that have been imported from NALD, and those entered into the digital service.

In the digital service addresses must conform to the EA address standard.  We therefore use the following mapping;

| CRM field |   Service field   | NALD field |
|-----------|-------------------|------------|
| address_1 | Sub-building name | ADDR_LINE1 |
| address_2 | Building number   | ADDR_LINE2 |
| address_3 | Building name     | ADDR_LINE3 |
| address_4 | Street name       | ADDR_LINE4 |
| town      | Town or city      | TOWN       |
| county    | County            | COUNTY     |
| postcode  | Postcode or zip   | POSTCODE   |
| country   | Country           | COUNTRY    |

Where:

* The data_source field is `nald`, the address has been imported from NALD and follows no particular pattern.
* The data_source field is `wrls`, the address has been entered into the digital service and should conform to the EA address standard, with the above field mapping