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