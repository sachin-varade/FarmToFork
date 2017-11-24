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

var logisticA2PConfig = config.network.logisticA2P;
var logisticP2IConfig = config.network.logisticP2I;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var logisticService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    logisticService.getAllLogisticA2PTransactions = function(option, value){
        console.log("getAllLogisticTransactions");
        return fabric_client.getUserContext(users.logisticA2PUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                logisticA2PConfig.channels.abattoirchannel.chaincodeId, 
                "getAllLogisticTransactions", 
                [option, value]);
        }).then((results) => {            
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.saveLogisticA2PTransaction = function(logisticTransaction){
        console.log("saveLogisticTransaction");
        return fabric_client.getUserContext(users.logisticA2PUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticA2PConfig.channels.abattoirchannel.chaincodeId, 
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
                    logisticTransaction.currentStatus,
                    logisticTransaction.inTransitDateTime,
                    logisticTransaction.actualDeliveryDateTime
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.updateLogisticA2PTransactionStatus = function(logisticTransaction){
        console.log("updateLogisticTransactionStatus");
        return fabric_client.getUserContext(users.logisticA2PUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticA2PConfig.channels.abattoirchannel.chaincodeId,                  
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

    logisticService.pushIotDetailsToLogisticA2PTransaction = function(iotData){
        console.log("pushIotDetailsToLogisticTransaction");
        return fabric_client.getUserContext(users.logisticA2PUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.abattoirchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticA2PConfig.channels.abattoirchannel.chaincodeId,                 
                "pushIotDetailsToLogisticTransaction",  
                [   
                    iotData.consignmentNumber,                 
                    iotData.logisticId.toString(), 
                    iotData.temp.toString(),
                    iotData.location,
                    iotData.date                
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
        
    logisticService.createVehicle = function(){
        console.log("createVehicle");
        return fabric_client.getUserContext(users.logisticUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticA2PConfig.channels.processorchannel.chaincodeId, 
                "createVehicle",  
                ["Volvo", "V001", "V001", "Jim", "X1", "E1", "G1", "White", ""]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.getAllLogisticP2ITransactions = function(option, value){
        console.log("getAllLogisticP2ITransactions");
        return fabric_client.getUserContext(users.logisticP2IUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                logisticP2IConfig.channels.processorchannel.chaincodeId, 
                "getAllLogisticTransactions", 
                [option, value]);
        }).then((results) => {            
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.saveLogisticP2ITransaction = function(logisticTransaction){
        console.log("saveLogisticTransaction");
        return fabric_client.getUserContext(users.logisticP2IUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticP2IConfig.channels.processorchannel.chaincodeId, 
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
                    logisticTransaction.currentStatus,
                    logisticTransaction.inTransitDateTime,
                    logisticTransaction.actualDeliveryDateTime
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    logisticService.updateLogisticP2ITransactionStatus = function(logisticTransaction){
        console.log("updateLogisticTransactionStatus");
        return fabric_client.getUserContext(users.logisticP2IUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticP2IConfig.channels.processorchannel.chaincodeId,                  
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

    logisticService.pushIotDetailsToLogisticP2ITransaction = function(iotData){
        console.log("pushIotDetailsToLogisticTransaction");
        return fabric_client.getUserContext(users.logisticP2IUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);            
            return invokeChainCode.invokeChainCode(fabric_client, 
                channels.processorchannel, 
                eventHubPeers.logisticEventHubPeer._url, 
                //"grpc://localhost:8053",
                logisticP2IConfig.channels.processorchannel.chaincodeId,                 
                "pushIotDetailsToLogisticTransaction",  
                [   
                    iotData.consignmentNumber,                 
                    iotData.logisticId.toString(), 
                    iotData.temp.toString(),
                    iotData.location,
                    iotData.date                
                ]                
            );                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
	return logisticService;
};

