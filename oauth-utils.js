var Client = require('node-rest-client').Client;
var quertystring = require('querystring');

var client = new Client();

client.registerMethod("oneDriveToken", "https://login.microsoftonline.com/common/oauth2/v2.0/token", "POST");

module.exports = {
    onedrive: {
        
    }
};