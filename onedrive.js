var secrets = require('./secrets');
var oauth_utils = require('./oauth-utils');
var format = require('string-format');
var guid = require('guid');

var oauthEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={0}&scope=user.read&response_type=code&state={1}&redirect_uri={2}';
var callback = 'http://localhost/onedrive/callback'

module.exports = {
    register: function (app) {
        app.get('/onedrive/auth', function (req, res) {
            res.redirect(format(oauthEndpoint, secrets.onedrive.id, guid.raw(), encodeURIComponent(callback)));
        });

        app.get('/onedrive/callback', function (req, res) {
            oauth_utils.onedrive.GetToken(secrets.onedrive.id, callback, secrets.onedrive.secret, req.query.code, res, req.query.state);
        });
    }
}