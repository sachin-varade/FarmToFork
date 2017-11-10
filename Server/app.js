"use strict";

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = require("./routes/routes");
app.use('/api', router);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;       
app.listen(port);
console.log('Running on port ' + port);