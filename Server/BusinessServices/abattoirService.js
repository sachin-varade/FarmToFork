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
const save = require('save-file');
var crypto = require('crypto');
var fs = require('fs');
var commonData = require('../data/common.json');

var abattoirConfig = config.network.abattoir;
var member_user;

module.exports = function (fabric_client, channels, peers, eventHubPeers, orderer, users) {
	var abattoirService = {};
    fabric_client = fabric_client;
    channels = channels;
    peers = peers;
    eventHubPeers = eventHubPeers;
    orderer = orderer;

    abattoirService.getUniqueId = function(option, value){
        console.log("getUniqueId");
        return fabric_client.getUserContext(users.abattoirUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.abattoirchannel, 
                abattoirConfig.channels.abattoirchannel.chaincodeId, 
                "getUniqueId", 
                [option, value]);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

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
            var algo = 'md5';
            var shasum = crypto.createHash(algo);
            
            var file = '../certificates/'+ element.fileName;
            var s = fs.ReadStream(file);
            s.on('data', function(d) { shasum.update(d); });
            s.on('end', function() {
                var d = shasum.digest('hex');
                console.log(d);
            });

            if(certString == "")
                certString = element.id +"^"+ element.name +"^"+ element.fileName;
            else
                certString += ","+ element.id +"^"+ element.name +"^"+ element.fileName;
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
                    abattoirReceived.receiptBatchId,
                    abattoirReceived.livestockBatchId,
                    abattoirReceived.receiptOn,
                    abattoirReceived.farmer.id.toString(),
                    abattoirReceived.guidNumber,
                    abattoirReceived.materialName ? abattoirReceived.materialName : abattoirReceived.guidNumber,
                    abattoirReceived.materialGrade,
                    abattoirReceived.usedByDate? abattoirReceived.usedByDate: "",
                    abattoirReceived.quantity.toString(),
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
                    abattoirDispatch.dispatchDate,
                    abattoirDispatch.logistic.id.toString(),
                    abattoirDispatch.salesOrder,
                    abattoirDispatch.purchaseOrderReferenceNumber,
                    abattoirDispatch.guidNumber,
                    abattoirDispatch.materialName,
                    abattoirDispatch.materialGrade,
                    abattoirDispatch.fatCoverClass,
                    abattoirDispatch.receiptBatchId,  
                    abattoirDispatch.temperatureStorageMin,
                    abattoirDispatch.temperatureStorageMax,
                    abattoirDispatch.productionDate,
                    abattoirDispatch.usedByDate? abattoirDispatch.usedByDate: "",
                    abattoirDispatch.quantity.toString(),
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

    abattoirService.uploadCertificate = function(files){
        var file;
        var fileName='';
        var ext = 'png';
        var fileNameList = [];
        
        commonData.farmersCertificates.forEach(element => {
            file = element.name == "GFSI" ? files.GFSI : (element.name == "BRC" ? files.BRC : (element.name == "KRAV" ? files.KRAV : (element.name == "IFOAM" ? files.IFOAM : "")));
            if(file){
                if(file.name){
                    ext = file.name.split('.');
                    ext = ext[ext.length-1];
                }
                
                fileName = 'certificate-'+ element.name +'-'+ crypto.randomBytes(16).toString('hex')	+'.'+ ext;
                fileNameList.push({id: element.id, name: element.name, fileName: fileName, fileData: file.data});
            }
        });

        fileNameList.forEach(element => {
            save(element.fileData, "../certificates/"+ element.fileName, (err, data) => {
                if (err) throw err;
            });
            element.fileData = null;
        });

        return fileNameList;
    }

	return abattoirService;
};

