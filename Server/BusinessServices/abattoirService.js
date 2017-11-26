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
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var abattoirService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    abattoirService.getAllAbattoirReceived = function(option, value){
        console.log("getAllAbattoirReceived");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllAbattoirReceived", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.getAllAbattoirDispatch = function(option, value){
        console.log("getAllAbattoirDispatch");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllAbattoirDispatch", 
                [option, value]);
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
                    abattoirReceived.usedByDate,
                    abattoirReceived.quantity,
                    abattoirReceived.quantityUnit,
                    certString,
                    abattoirReceived.updatedBy.toString(),
                    abattoirReceived.updatedOn                    
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.saveAbattoirDispatch = function(abattoirDispatch){
        console.log("saveAbattoirDispatch");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.abattoirEventHubPeer._url, 
                //"grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "saveAbattoirDispatch",  
                [                    
                    abattoirDispatch.abattoirId.toString(), 
                    abattoirDispatch.consignmentNumber,
                    abattoirDispatch.purchaseOrderReferenceNumber,
                    abattoirDispatch.rawMaterialBatchNumber,                    
                    abattoirDispatch.guidNumber,
                    abattoirDispatch.materialName,
                    abattoirDispatch.materialGrade,
                    abattoirDispatch.temperatureStorageMin,
                    abattoirDispatch.temperatureStorageMax,
                    abattoirDispatch.productionDate,
                    abattoirDispatch.usedByDate,
                    abattoirDispatch.quantity,
                    abattoirDispatch.quantityUnit,
                    abattoirDispatch.updatedBy.toString(),
                    abattoirDispatch.updatedOn                  
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }   
    
    abattoirService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.abattoirchannel, 
                peers.abattoirPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.abattoirchannel, 
                peers.abattoirPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.abattoirchannel, 
                peers.abattoirPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

	return abattoirService;
};

