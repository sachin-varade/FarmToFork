"use strict";
var express = require("express");
var channelObjects = require("../BusinessServices/channelObjects.js");
var abattoirService, logisticService, processorService, ikeaService, userService, blockService, productTrackerService;
setTimeout(function() {    
    abattoirService = require("../BusinessServices/abattoirService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    logisticService = require("../BusinessServices/logisticService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
    processorService = require("../BusinessServices/processorService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	ikeaService = require("../BusinessServices/ikeaService.js")(channelObjects.fabric_client, channelObjects.channels, channelObjects.peers, channelObjects.eventHubPeers, channelObjects.orderer, channelObjects.usersForTransaction);
	userService = require("../BusinessServices/userService.js")();
	blockService = require("../BusinessServices/blockService.js")(abattoirService, logisticService, processorService, ikeaService);
	productTrackerService = require("../BusinessServices/productTrackerService.js")(abattoirService, logisticService, processorService, ikeaService, userService);
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
// ------------------------ COMMON routes --------------------
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

// ------------------------ Abattoir routes --------------------

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

// ------------------------ Logistics routes --------------------
//A2P
router.get("/A2P/getAllLogisticTransactions/:option/:value?", function(req, res) {    
    var promise = logisticService.getAllLogisticA2PTransactions(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/A2P/saveLogisticTransaction", function(req, res) {    
	var promise = logisticService.saveLogisticA2PTransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/A2P/updateLogisticTransactionStatus", function(req, res) {    
	var promise = logisticService.updateLogisticA2PTransactionStatus(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/A2P/pushIotDetailsToLogisticTransaction", function(req, res) {    
	var promise = logisticService.pushIotDetailsToLogisticA2PTransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

//P2I
router.get("/P2I/getAllLogisticTransactions/:option/:value?", function(req, res) {    
    var promise = logisticService.getAllLogisticP2ITransactions(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/P2I/saveLogisticTransaction", function(req, res) {    
	var promise = logisticService.saveLogisticP2ITransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/P2I/updateLogisticTransactionStatus", function(req, res) {    
	var promise = logisticService.updateLogisticP2ITransactionStatus(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.post("/P2I/pushIotDetailsToLogisticTransaction", function(req, res) {    
	var promise = logisticService.pushIotDetailsToLogisticP2ITransaction(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

// ------------------------ Processor routes --------------------

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


// ------------------------ IKEA routes --------------------

router.post("/saveIkeaReceived", function(req, res) {    
	var promise = ikeaService.saveIkeaReceived(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.get("/getAllIkeaReceived/:option/:value?", function(req, res) {    
    var promise = ikeaService.getAllIkeaReceived(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/saveIkeaDispatch", function(req, res) {    
	var promise = ikeaService.saveIkeaDispatch(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

router.get("/getAllIkeaDispatch/:option/:value?", function(req, res) {    
    var promise = ikeaService.getAllIkeaDispatch(req.params.option, req.params.value?req.params.value: "");
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

// ------------------------ BLOCK routes --------------------
router.get("/queryInfo/:role", function(req, res) {    
    var promise = blockService.queryInfo(req.params.role);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/queryBlock/:role/:blockNumber", function(req, res) {    
    var promise = blockService.queryBlock(req.params.role, req.params.blockNumber);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.get("/getRecentBlocks/:role/:blockNumber", function(req, res) {    
    var promise = blockService.getRecentBlocks(req.params.role, req.params.blockNumber);
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

// ----------------------- Product Tracker ----------------------

router.get("/getProductTrackingDetails/:option/:value?", function(req, res) {    
    var promise = productTrackerService.getProductTrackingDetails(req.params.option, req.params.value?req.params.value: "")
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

// IKEA Bill
router.get("/getProductTrackingDetails/:billNumber?", function(req, res) {    
    var promise = ikeaService.getIkeaBillDetails(req.params.billNumber)
	promise.then(function(resp,err){
		res.send(resp);
	});	
});

router.post("/saveIkeaBill", function(req, res) {    
	var promise = ikeaService.saveIkeaBill(req.body);
	promise.then(function(resp,err){
		res.send(resp);
	});			
});

module.exports = router;
