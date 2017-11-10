'use strict';
var fabric_client;
var channels;
var peers;
var eventHubPeers;
var orderer;
var helper = require('./helper.js');
var queryChainCode = require('../hfcInterface/queryChainCode.js');
var invokeChainCode = require('../hfcInterface/invokeChainCode.js');
var config = require('../config/config.js');

var abattoirConfig = config.network.abattoir;
var logisticConfig = config.network.logistic;
var processorConfig = config.network.processor;
var ikeaConfig = config.network.ikea;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var processorService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    processorService.getAllVehicles = function(){
        console.log("getAllVehicles");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                processorConfig.channels.processorchannel.chaincodeId, 
                "getAllVehicles", 
                [""]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.createVehicle = function(){
        console.log("createVehicle");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.processorEventHubPeer._url, 
                //"grpc://localhost:7053",
                processorConfig.channels.processorchannel.chaincodeId, 
                "createVehicle",  
                ["Volvo", "V001", "V001", "Jim", "X1", "E1", "G1", "White", ""]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return processorService;
};

