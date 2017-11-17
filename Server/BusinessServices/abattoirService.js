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

    abattoirService.getAllAbattoirDispatch = function(option){
        console.log("getAllAbattoirDispatch");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllAbattoirDispatch", 
                [option]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.getAllLogisticTransactions = function(option){
        console.log("getAllLogisticTransactions");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getAllLogisticTransactions", 
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
                    abattoirDispatch.userByDate,
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

    abattoirService.saveLogisticTransaction = function(logisticTransaction){
        console.log("saveLogisticTransaction");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.abattoirEventHubPeer._url, 
                //"grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "saveLogisticTransaction",  
                [                    
                    logisticTransaction.logisticId.toString(), 
                    logisticTransaction.logisticType,
                    logisticTransaction.consignmentNumber,
                    logisticTransaction.routeId,
                    logisticTransaction.abattoirConsignmentNumber,
                    logisticTransaction.vehicleId.toString(),                    
                    logisticTransaction.vehicleTypeId.toString(),
                    logisticTransaction.dispatchDateTime,
                    logisticTransaction.expectedDeliveryDateTime,                    
                    logisticTransaction.temperatureStorageMin,
                    logisticTransaction.temperatureStorageMax,
                    logisticTransaction.quantity,
                    logisticTransaction.quantityUnit,                    
                    logisticTransaction.handlingInstruction,
                    logisticTransaction.updatedOn,
                    logisticTransaction.updatedBy.toString(),
                    logisticTransaction.currentStatus
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    abattoirService.updateLogisticTransactionStatus = function(logisticTransaction){
        console.log("updateLogisticTransactionStatus");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.abattoirEventHubPeer._url, 
                //"grpc://localhost:7053",
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "updateLogisticTransactionStatus",  
                [   
                    logisticTransaction.consignmentNumber,                 
                    logisticTransaction.logisticId.toString(), 
                    logisticTransaction.currentStatus,
                    logisticTransaction.updatedOn,
                    logisticTransaction.actualDeliveryDateTime                
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return abattoirService;
};

