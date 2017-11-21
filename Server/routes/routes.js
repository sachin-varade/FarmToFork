"use strict";
var express = require("express");
var channelObjects = require("../BusinessServices/channelObjects.js");
var abattoirService, logisticService, processorService, ikeaService, userService;
setTimeout(function() {    
    abattoirService = require("../BusinessServices/abattoirService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    logisticService = require("../BusinessServices/logisticService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    processorService = require("../BusinessServices/processorService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	ikeaService = require("../BusinessServices/ikeaService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	userService = require("../BusinessServices/userService.js")();
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
router.post("/login", function(req, res) {    
	var userData = userService.login(req.body);	
	res.send(userData);
});

router.get("/getUserData", function(req, res) {    
	var userData = userService.getUserData();	
	res.send(userData);
});

router.get("/getCommonData", function(req, res) {    
	var commonData = userService.getCommonData();	
	res.send(commonData);
});

router.get("/getAllAbattoirReceived/:option/:value?", function(req, res) {    
    var promise = abattoirService.getAllAbattoirReceived(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/saveAbattoirReceived", function(req, res) {    
	var promise = abattoirService.saveAbattoirReceived(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.get("/getAllAbattoirDispatch/:option/:value?", function(req, res) {    
    var promise = abattoirService.getAllAbattoirDispatch(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/saveAbattoirDispatch", function(req, res) {    
	var promise = abattoirService.saveAbattoirDispatch(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.get("/getAllLogisticTransactions/:option/:value?", function(req, res) {    
    var promise = abattoirService.getAllLogisticTransactions(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/saveLogisticTransaction", function(req, res) {    
	var promise = abattoirService.saveLogisticTransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/updateLogisticTransactionStatus", function(req, res) {    
	var promise = abattoirService.updateLogisticTransactionStatus(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/saveProcessorReceived", function(req, res) {    
	var promise = processorService.saveProcessorReceived(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/saveProcessingTransaction", function(req, res) {    
	var promise = processorService.saveProcessingTransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/saveProcessorDispatch", function(req, res) {    
	var promise = processorService.saveProcessorDispatch(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.get("/getAllProcessorReceived/:option/:value?", function(req, res) {    
    var promise = processorService.getAllProcessorReceived(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllProcessingTransactions/:option/:value?", function(req, res) {    
    var promise = processorService.getAllProcessingTransactions(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getAllProcessorDispatch/:option/:value?", function(req, res) {    
    var promise = processorService.getAllProcessorDispatch(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

module.exports = router;
