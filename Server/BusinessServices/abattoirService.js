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
    
    abattoirService.getAllAbattoirReceived = function(option){
        console.log("getAllAbattoirReceived");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllAbattoirReceived", 
                [option]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.saveAbattoirReceived = function(abattoirReceived){
        console.log("saveAbattoirReceived");
        var certString = "";        
        abattoirReceived.certificates.forEach(element => {
            if(certString == "")
                certString = element.id +"^"+ element.name;
            else
                certString += ","+ element.id +"^"+ element.name;
        });
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.abattoirEventHubPeer._url, 
                //"grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "saveAbattoirReceived",  
                [
                    abattoirReceived.abattoirId.toString(), 
                    abattoirReceived.purchaseOrderReferenceNumber,
                    abattoirReceived.rawMaterialBatchNumber,
                    abattoirReceived.farmer.id.toString(),
                    abattoirReceived.guidNumber,
                    abattoirReceived.materialName,
                    abattoirReceived.materialGrade,
                    abattoirReceived.userByDate,
                    abattoirReceived.quantity,
                    abattoirReceived.quantityUnit,
                    certString
                ]
                //["P001", "C001", "01-01-2017", "Jim", "Break", "Break", "na", "B001", "" ]
            );                
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
                eventHubPeers.abattoirEventHubPeer._url, 
                //"grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "createPart",  
                ["P001", "C001", "01-01-2017", "Jim", "Break", "Break", "na", "B001", "" ]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return abattoirService;
};

