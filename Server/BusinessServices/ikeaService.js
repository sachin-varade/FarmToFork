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
	var ikeaService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;


    ikeaService.saveIkeaReceived = function(ikeaReceived){
        console.log("saveIkeaReceived");
        var acceptanceCriteria = "";
        ikeaReceived.acceptanceCheckList.forEach(element => {
            if(acceptanceCriteria == "")
                acceptanceCriteria = element.id +"^"+ element.ruleCondition +"^"+ element.conditionSatisfied;
            else
                acceptanceCriteria += ","+ element.id +"^"+ element.ruleCondition +"^"+ element.conditionSatisfied;
        });
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.ikeachannel, 
                eventHubPeers.processorEventHubPeer._url, 
                //"grpc://localhost:7053",
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "saveIkeaReceived",  
                [
                    ikeaReceived.ikeaReceivedNumber,
                    ikeaReceived.ikeaStoreId.toString(),
                    ikeaReceived.purchaseOrderNumber,
                    ikeaReceived.consignmentNumber,
                    ikeaReceived.transportConsitionSatisfied.toString(),
                    ikeaReceived.guidNumber,
                    ikeaReceived.materialName,
                    ikeaReceived.materialGrade,
                    ikeaReceived.quantity,
                    ikeaReceived.quantityUnit,
                    ikeaReceived.usedByDate,
                    ikeaReceived.receivedDate,
                    ikeaReceived.transitTime,
                    ikeaReceived.storage,
                    acceptanceCriteria,                    
                    ikeaReceived.updatedOn,
                    ikeaReceived.updatedBy.toString()
                ]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.getAllIkeaReceived = function(option, value){
        console.log("getAllIkeaReceived");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "getAllIkeaReceived", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }


    ikeaService.query = function(){
        console.log("query");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.ikeachannel, 
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "query", 
                ["a"]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.invoke = function(){
        console.log("invoke");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.ikeachannel, 
                eventHubPeers.ikeaEventHubPeer._url, 
                //"grpc://localhost:10053",
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "invoke",  
                ["a","b","10"]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return ikeaService;
};

