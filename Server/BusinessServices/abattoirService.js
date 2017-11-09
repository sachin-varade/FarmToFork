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
	var abattoirService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    abattoirService.getAllParts = function(){
        console.log("getAllParts");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllParts", 
                ["a","b","10"]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.createPart = function(){
        console.log("createPart");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                //eventHubPeers.ikeaEventHubPeer._url, 
                "grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "createPart",  
                ["P002", "C001", "01-01-2017", "Jim", "Break", "Break", "na", "B001", "" ]);
                // return invokeChainCode.invokeChainCode(channelObjects.fabric_client, 
                //     channelObjects.ikeachannel, "grpc://localhost:10053", "ikeaCC", "invoke", ["a","b","10"]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return abattoirService;
};

