var Client = require('node-rest-client').Client;
var quertystring = require('querystring');

var client = new Client();

client.registerMethod("oneDriveToken", "https://login.microsoftonline.com/common/oauth2/v2.0/token", "POST");



module.exports = {
    onedrive: {
        GetToken: function (id, uri, secret, authCode, res, user) {
            var args = {
                headers: { "content-type": "application/x-www-form-urlencoded" },
                data: {
                    client_id: id,
                    redirect_uri: uri,
                    client_secret: secret,
                    code: authCode,
                    grant_type: 'authorization_code'
                }
            };

            args.data = quertystring.stringify(args.data);
            client.methods.oneDriveToken(args, function (data, response) {
                console.log(data);
                console.log(response);
                res.send('got code:' + user);
            });
        }
    }
};