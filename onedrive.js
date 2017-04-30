var secrets = require('./secrets');
var oauth_utils = require('./oauth-utils');
var format = require('string-format');
var guid = require('guid');
var quertystring = require('querystring');
var Client = require('node-rest-client').Client;

var oauthEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={0}&scope={1}&response_type=code&state={2}&redirect_uri={3}';
var callback = 'http://localhost/onedrive/callback'
var apiBase = 'https://graph.microsoft.com/v1.0';
var scopes = 'user.read calendars.read' //space delimited list of scopes

module.exports.OneDrive = class OneDrive {
    constructor() {
        var options = {
            mimetypes: {
                json: ["application/json", "application/json;odata.metadata=minimal;odata.streaming=true;IEEE754Compatible=false;charset=utf-8", "application/json; charset=utf-8"],
            }
        };
        this.client = new Client(options);
        this.client.registerMethod("fetchCurrentUser", apiBase + "/me", "GET");
        this.client.registerMethod("oneDriveToken", "https://login.microsoftonline.com/common/oauth2/v2.0/token", "POST");
        this.userCode = '';
    }
    register(app) {
        var _this = this;

        app.get('/onedrive/auth', function (req, res) {
            res.redirect(format(oauthEndpoint, secrets.onedrive.id, encodeURIComponent(scopes), guid.raw(), encodeURIComponent(callback)));
        });

        app.get('/onedrive/callback', function (req, res) {
            var args = {
                headers: { "content-type": "application/x-www-form-urlencoded" },
                data: {
                    client_id: secrets.onedrive.id,
                    redirect_uri: callback,
                    client_secret: secrets.onedrive.secret,
                    code: req.query.code,
                    grant_type: 'authorization_code'
                }
            };

            args.data = quertystring.stringify(args.data);
            _this.client.methods.oneDriveToken(args, function (data, response) {
                if (response.statusCode == 200) {
                    data = JSON.parse(data.toString('utf8')); //TODO: This shouldn't be necessary. WHY IS IT NOT AUTO PARSING!?
                    _this.userCode = data.access_token;
                    res.send('got code for user: ' + req.query.state);
                }
                else {
                    res.send("error fetching code: " + data);
                }

            });
        });
    }

    getUserInfo(res) {
        if (this.userCode == '') {
            res.send("please authenticate a user before trying to fetch");
            return;
        }

        var args = {
            headers: {
                "authorization": "bearer " + this.userCode,
                'content-type': 'application/json'
            }
        };

        this.client.methods.fetchCurrentUser(args, function (data, response) {
            if (response.statusCode == 200) {
                res.send("Hi " + data.givenName + "!");
            }
            else {
                res.send("error fetching current user: " + data);
            }
        });
    }
}