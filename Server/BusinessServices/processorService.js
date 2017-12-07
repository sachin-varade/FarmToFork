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
var uuid = require('node-uuid');
var commonData = require('../data/common.json');

var processorConfig = config.network.processor;
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
        var processingAction = "";
        processingTransaction.processingAction.forEach(element => {
            if(processingAction === "")
                processingAction = element.action;
            else
                processingAction += ","+ element.action;
          });
        var qualityControlDocument = "";        
        if(processingTransaction.qualityControlDocument){
            processingTransaction.qualityControlDocument.forEach(element => {
                if(qualityControlDocument == "")
                    qualityControlDocument = element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
                else
                    qualityControlDocument += ","+ element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
            });
        }
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
                    processingTransaction.processorId.toString(),
                    processingTransaction.processorReceiptNumber,
                    processingTransaction.productCode ? processingTransaction.productCode : "",
                    processingTransaction.guidNumber,
                    processingTransaction.materialName,
                    processingTransaction.materialGrade ? processingTransaction.materialGrade : "",
                    processingTransaction.quantity.toString(),
                    processingTransaction.quantityUnit,
                    processingTransaction.usedByDate,
                    processingTransaction.packagingDate,                    
                    qualityControlDocument,
                    processingTransaction.storage,
                    processingAction,
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
        var qualityControlDocument = "";        
        if(processorDispatch.qualityControlDocument){
            processorDispatch.qualityControlDocument.forEach(element => {
                if(qualityControlDocument == "")
                    qualityControlDocument = element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
                else
                    qualityControlDocument += ","+ element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
            });
        }
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
                    processorDispatch.materialGrade ? processorDispatch.materialGrade : "",
                    processorDispatch.temperatureStorageMin,
                    processorDispatch.temperatureStorageMax,
                    processorDispatch.packagingDate,
                    processorDispatch.usedByDate,
                    processorDispatch.dispatchDate,
                    processorDispatch.quantity.toString(),
                    processorDispatch.quantityUnit,
                    qualityControlDocument,
                    processorDispatch.storage ? processorDispatch.storage : "",
                    processorDispatch.updatedBy.toString(),
                    processorDispatch.updatedOn,
                ]);                
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }
    
    processorService.getUniqueId = function(option, value){
        console.log("getUniqueId");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryChainCode(channels.processorchannel, 
                processorConfig.channels.processorchannel.chaincodeId, 
                "getUniqueId", 
                [option, value]);
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

    processorService.queryInfo = function(){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryInfo(channels.processorchannel, 
                peers.processorPeer);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.queryBlock = function(blockNumber){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlock(channels.processorchannel, 
                peers.processorPeer, blockNumber);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.queryBlockByHash = function(blockHash){
        console.log("queryInfo");
        return fabric_client.getUserContext(users.processorUser.enrollmentID, true)
        .then((user_from_store) => {
            helper.checkUserEnrolled(user_from_store);
            return queryChainCode.queryBlockByHash(channels.processorchannel, 
                peers.processorPeer, blockHash);
        }).then((results) => {
            return results;
        }).catch((err) => {
            throw err;
        });
    }

    processorService.uploadQualityControlDocument = function(files){
        var file;
        var fileName='';
        var ext = 'png';
        var fileNameList = [];
        if(files){
            commonData.qualityControlDocuments.forEach(element => {
                file = element.name == "DNA Test" ? files.DNATest : "";
                if(file){
                    if(file.name){
                        ext = file.name.split('.');
                        ext = ext[ext.length-1];
                    }
                    
                    fileName = 'qcd-'+ element.name +'-'+ uuid.v4() +'.'+ ext;
                    fileNameList.push({id: element.id, name: element.name, fileName: fileName, fileData: file.data});
                }
            });
            var promises = [];
            fileNameList.forEach(element => {
                promises.push(
                save(element.fileData, "../qualityControlDocuments/"+ element.fileName, (err, data) => {
                    if (err) throw err;                    
                })
                );              
            });

            return Promise.all(promises)
            .then((results) => {
                var hashPromises = [];
                var count= 0;
                fileNameList.forEach(element => {
                    hashPromises.push(
                        gen_hash(element)
                        .then((hash) => {
                            element.hash = hash;        
                            element.fileData = null;
                        })
                    );
                });
                
                return Promise.all(hashPromises)
                .then((results) => {
                    return fileNameList;
                }).catch((err) => {
                    throw err;
                });
            }).catch((err) => {
                throw err;
            });
        } 
        else{
            return fileNameList;
        }       
    }

    function gen_hash (element) {
        return new Promise((resolve, reject) => {
            var algo = 'md5';
            var shasum = crypto.createHash(algo);
            var file = 'Server/qualityControlDocuments/'+ element.fileName;
            var s = fs.ReadStream(file);
            s.on('end', function() {
                var d = shasum.digest('hex');
                resolve(d);
            });
            s.on('error', reject);
            s.on('data', function(d) { shasum.update(d); });
        });
    }
	return processorService;
};

