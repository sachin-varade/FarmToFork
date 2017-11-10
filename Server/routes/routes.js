"use strict";
var express = require("express");
var channelObjects = require("../BusinessServices/channelObjects.js");
var abattoirService, logisticService, processorService;
setTimeout(function() {    
    abattoirService = require("../BusinessServices/abattoirService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    logisticService = require("../BusinessServices/logisticService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    processorService = require("../BusinessServices/processorService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
}, 2000);

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();             

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
router.get("/", function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// REGISTER OUR ROUTES -------------------------------
router.get("/getAllParts", function(req, res) {    
    var promise = abattoirService.getAllParts();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/createPart", function(req, res) {    
    var promise = abattoirService.createPart();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllVehicles", function(req, res) {    
    var promise = logisticService.getAllVehicles();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/createVehicle", function(req, res) {    
    var promise = logisticService.createVehicle();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllVehicles1", function(req, res) {    
    var promise = processorService.getAllVehicles();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/createVehicle1", function(req, res) {    
    var promise = processorService.createVehicle();
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

module.exports = router;
