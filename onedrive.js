var secrets = require('./secrets');
var oauth_utils = require('./oauth-utils');
var format = require('string-format');
var guid = require('guid');
var quertystring = require('querystring');
var Client = require('node-rest-client').Client;

var oauthEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={0}&scope={1}&response_type=code&state={2}&redirect_uri={3}';
var callback = 'http://localhost/onedrive/callback'
var scopes = 'user.read' //space delimited list of scopes

var GetToken = function (id, uri, secret, authCode, res, user) {
    var client = new Client();
    client.registerMethod("oneDriveToken", "https://login.microsoftonline.com/common/oauth2/v2.0/token", "POST");

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
        if (response.statusCode == 200) {
            var code = data.access_token;
            res.send('got code for user: ' + user);
        }
        else {
            res.send("error fetching code: " + data);
        }

    });
}

module.exports = {
    register: function (app) {
        app.get('/onedrive/auth', function (req, res) {
            res.redirect(format(oauthEndpoint, secrets.onedrive.id, encodeURIComponent(scopes), guid.raw(), encodeURIComponent(callback)));
        });

        app.get('/onedrive/callback', function (req, res) {
            GetToken(secrets.onedrive.id, callback, secrets.onedrive.secret, req.query.code, res, req.query.state);
        });
    }
}