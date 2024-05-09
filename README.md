# JWT-Kong-API-gateway-postman

I made this repository to share a pre-request script for Postman to generate a JWT token and write it to the Postman global variable 'ACCESS_TOKEN'. 

This variable can then be used in the request header for authorization.

To use this script in Postman, you first need to cache third-party librariy *jsrsasign*.
To do this, you need to add this line on tests tab script:

pm.globals.set("jsrsasign-js", responseBody);

And perform a GET request in Postman:

GET https://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js
