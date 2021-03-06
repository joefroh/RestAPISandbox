var express = require('express');
var app = express();

//require api modules
var onedriveAPI = require('./onedrive');
var onedrive = new onedriveAPI.OneDrive();

app.get('/', function (req, res) {
    res.send("hello world");
});

//register APIs
onedrive.register(app);

app.get('/currentUser', function (req, res){
    onedrive.getUserInfo(res);
});


//start server
app.listen(80, function () {
    console.log("express listening to port 80");
});