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
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.ikeachannel, 
                eventHubPeers.ikeaEventHubPeer._url, 
                //"grpc://localhost:7053",
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "saveIkeaReceived",  
                [
                    ikeaReceived.ikeaReceivedNumber,
                    ikeaReceived.ikeaId.toString(),
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
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.ikeachannel, 
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "getAllIkeaReceived", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.saveIkeaDispatch = function(ikeaDispatch){
        console.log("saveIkeaDispatch");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.ikeachannel, 
                eventHubPeers.ikeaEventHubPeer._url, 
                //"grpc://localhost:7053",
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "saveIkeaDispatch",  
                [
                    ikeaDispatch.ikeaDispatchNumber,
                    ikeaDispatch.ikeaReceivedNumber,
                    ikeaDispatch.ikeaId.toString(),
                    ikeaDispatch.guidNumber,
                    ikeaDispatch.materialName,
                    ikeaDispatch.materialGrade,
                    ikeaDispatch.quantity,
                    ikeaDispatch.quantityUnit,
                    ikeaDispatch.dispatchDateTime
                ]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.getAllIkeaDispatch = function(option, value){
        console.log("getAllIkeaDispatch");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.ikeachannel, 
                ikeaConfig.channels.ikeachannel.chaincodeId, 
                "getAllIkeaDispatch", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.ikeachannel, 
                peers.ikeaPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.ikeachannel, 
                peers.ikeaPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    ikeaService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.ikeaUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.ikeachannel, 
                peers.ikeaPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
	return ikeaService;
};

