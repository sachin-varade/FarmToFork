"use strict";

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var router = require("./routes/routes");
var cors = require("cors");


// Enable CORS preflight across the board.
app.options("*", cors());
app.use(cors());
//app.use(cors({origin: 'http://localhost'}));

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router);
var port = process.env.PORT || 8080;       
app.listen(port);
console.log('Running on port ' + port);