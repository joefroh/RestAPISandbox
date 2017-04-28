var express = require('express');
var app = express();

var secrets = require('./secrets');
var format = require('string-format');
var oauth_utils = require('./oauth-utils.js');
var guid = require('guid');
var usercallback = '';

var oauthEndpoint = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={0}&scope=user.read&response_type=code&state={1}&redirect_uri={2}';
var callback = 'http://localhost/authODCallback'

app.get('/', function (req, res) {
    res.send("hello world");
});

app.get('/authOD', function (req, res) {
    res.redirect(format(oauthEndpoint, secrets.onedrive.id, guid.raw(), encodeURIComponent(callback)));
});

app.get('/authODCallback', function (req, res) {
    oauth_utils.onedrive.GetToken(secrets.onedrive.id, callback, secrets.onedrive.secret, req.query.code, res, req.query.state);
});

app.listen(80, function () {
    console.log("express listening to port 80");
});