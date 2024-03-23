var express = require('express');
var bodyParser = require("body-parser");
var app = express();
// var insertData = require('./services/crawler')

app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res, next) => {
    console.log("Hello");
    res.send({message: "Hello"});
})

app.listen(5000, () => {
    console.log("Web App");
    // insertData();
})