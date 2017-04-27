var express = require('express');
var app = express();

app.get('/', function(req,res) {
    res.send("hello world");
});


app.listen(80, function(){
    console.log("express listening to port 80");
});