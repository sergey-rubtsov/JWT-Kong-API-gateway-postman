# Automatic auth/JWT token generation for Kong gateway in Postman using Postman only.

I made this repository to share a pre-request script for Postman to generate a Kong API Gateway JWT token and write it to the Postman global variable 'ACCESS_TOKEN' for further authorization.
It also signs token with private key.

This variable can then be used in the request header for authorization.

It works without Node.js and uses only Postman itself.

To use this script in Postman, you first need to cache third-party librariy *jsrsasign*.
To do this, you need to add this line on tests tab script:

pm.globals.set("jsrsasign-js", responseBody);

And perform a GET request in Postman:

GET https://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js

After that add this code in Pre request Script tab and set Bearer Token authorization value as {{ACCESS_TOKEN}} on Authorization tab:

```
var navigator = {};
var window = {};
eval(pm.globals.get("jsrsasign-js")); //need to be cached before (read README first)
var JWS = KJUR.jws.JWS;
var uuid = require('uuid');
var myUUID = uuid.v4();

var currentTimestamp = Math.floor(Date.now() / 1000)

var data = {
	'iss': "ea235345465fha675767a", //your path to iss
	'aud': "https://login.microsoftonline.com/6djfbhjTESWC666SSDShh1/v2.0", //your path to aud
    'sub': "ea235345465fha675767a", //your path to sub
	'iat': currentTimestamp,
	'exp': currentTimestamp + 60,
	'jti': myUUID
}

var sPayload = JSON.stringify(data);

var header = {
	"x5t": "KL2+/t4645MMTrECfGTTho=", //Your header value
    "alg" : "RS256",
    "typ" : "JWT"
};

var sHeader = JSON.stringify(header);

//Your private key:
var privateKey = "-----BEGIN PRIVATE KEY-----\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
GKRTyjdnjfgjmnf973456fthjTeh4jfikUYTGFFGFRFGRFGRE5576YYYY3334\
CE=\
-----END PRIVATE KEY-----";

var token = JWS.sign(header.alg, sHeader, sPayload, privateKey);

var scope = "e376nfjgjf8874654756775hgjfg84e/.default"; //your scope, can be different for each application

const postRequest = {
  url: 'https://login.microsoftonline.com/e1234567890f/oauth2/v2.0/token', //your path to oauth2
  method: 'POST',
  timeout: 0,
  header: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: {
    mode: 'urlencoded',
    urlencoded: [
        {key:"grant_type", value: "client_credentials"},
        {key:"scope", value: scope},
        {key:"client_id", value: "e1234567890f"}, //your Client Id
        {key:"client_assertion_type", value: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"},
        {key:"client_assertion", value: token}
    ]}
};
pm.sendRequest(postRequest, function (err, res) {
    var responseJson = res.json();
    pm.environment.set('ACCESS_TOKEN', responseJson['access_token']);
});
```

After that, Pre request Script will generate and add authorization Bearer {{ACCESS_TOKEN}} to each request header.
