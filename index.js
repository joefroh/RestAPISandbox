var express = require('express');
var app = express();

//require api modules
var onedrive = require('./onedrive');

app.get('/', function (req, res) {
    res.send("hello world");
});

//register APIs
onedrive.register(app);


//start server
app.listen(80, function () {
    console.log("express listening to port 80");
});