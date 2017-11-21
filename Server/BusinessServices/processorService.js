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

    processorService.saveProcessorReceived = function(processorReceived){
        console.log("saveProcessorReceived");
        var acceptanceCriteria = "";
        processorReceived.acceptanceCheckList.forEach(element => {
            if(acceptanceCriteria == "")
                acceptanceCriteria = element.id +"^"+ element.ruleCondition +"^"+ element.conditionSatisfied;
            else
                acceptanceCriteria += ","+ element.id +"^"+ element.ruleCondition +"^"+ element.conditionSatisfied;
        });
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.processorEventHubPeer._url, 
                //"grpc://localhost:7053",
                processorConfig.channels.processorchannel.chaincodeId, 
                "saveProcessorReceived",  
                [
                    processorReceived.processorReceiptNumber,
                    processorReceived.processorId.toString(),
                    processorReceived.purchaseOrderNumber,
                    processorReceived.consignmentNumber,
                    processorReceived.transportConsitionSatisfied.toString(),
                    processorReceived.guidNumber,
                    processorReceived.materialName,
                    processorReceived.materialGrade,
                    processorReceived.quantity,
                    processorReceived.quantityUnit,
                    processorReceived.usedByDate,
                    processorReceived.receivedDate,
                    processorReceived.transitTime,
                    acceptanceCriteria,
                    processorReceived.updatedBy.toString(),
                    processorReceived.updatedOn
                ]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.saveProcessingTransaction = function(processingTransaction){
        console.log("saveProcessingTransaction");        
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.processorEventHubPeer._url, 
                //"grpc://localhost:7053",
                processorConfig.channels.processorchannel.chaincodeId, 
                "saveProcessingTransaction",  
                [
                    processingTransaction.processorBatchCode,
                    processingTransaction.processorBatchCode,
                    processingTransaction.processorId.toString(),
                    processingTransaction.processorReceiptNumber,
                    processingTransaction.productCode,
                    processingTransaction.guidNumber,
                    processingTransaction.materialName,
                    processingTransaction.materialGrade,
                    processingTransaction.quantity,
                    processingTransaction.quantityUnit,
                    processingTransaction.usedByDate,
                    processingTransaction.qualityControlDocument,
                    processingTransaction.storage,
                    processingTransaction.processingAction,                    
                    processingTransaction.updatedBy.toString(),
                    processingTransaction.updatedOn                    
                ]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.saveProcessorDispatch = function(processorDispatch){
        console.log("saveProcessorDispatch");        
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.processorEventHubPeer._url, 
                //"grpc://localhost:7053",
                processorConfig.channels.processorchannel.chaincodeId, 
                "saveProcessorDispatch",  
                [
                    processorDispatch.consignmentNumber,
                    processorDispatch.processorBatchCode,
                    processorDispatch.processorId.toString(),
                    processorDispatch.ikeaPurchaseOrderNumber,
                    processorDispatch.guidNumber,
                    processorDispatch.materialName,
                    processorDispatch.materialGrade,
                    processorDispatch.temperatureStorageMin,
                    processorDispatch.temperatureStorageMax,
                    processorDispatch.packagingDate,
                    processorDispatch.usedByDate,
                    processorDispatch.quantity,
                    processorDispatch.quantityUnit,
                    processorDispatch.qualityControlDocument,
                    processorDispatch.storage,
                    processorDispatch.updatedBy.toString(),
                    processorDispatch.updatedOn,
                ]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
    processorService.getAllProcessorReceived = function(option, value){
        console.log("getAllProcessorReceived");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                processorConfig.channels.processorchannel.chaincodeId, 
                "getAllProcessorReceived", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.getAllProcessingTransactions = function(option, value){
        console.log("getAllProcessingTransactions");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                processorConfig.channels.processorchannel.chaincodeId, 
                "getAllProcessingTransactions", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.getAllProcessorDispatch = function(option, value){
        console.log("getAllProcessorDispatch");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                processorConfig.channels.processorchannel.chaincodeId, 
                "getAllProcessorDispatch", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

	return processorService;
};

