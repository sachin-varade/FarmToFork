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
            if(certString == "")
                certString = element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
            else
                certString += ","+ element.id +"^"+ element.name +"^"+ element.fileName +"^"+ element.hash;
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
        if(files){
            commonData.farmersCertificates.forEach(element => {
                file = element.name == "GFSI" ? files.GFSI : (element.name == "BRC" ? files.BRC : (element.name == "KRAV" ? files.KRAV : (element.name == "IFOAM" ? files.IFOAM : "")));
                if(file){
                    if(file.name){
                        ext = file.name.split('.');
                        ext = ext[ext.length-1];
                    }
                    
                    fileName = 'certificate-'+ element.name +'-'+ uuid.v4() +'.'+ ext;
                    fileNameList.push({id: element.id, name: element.name, fileName: fileName, fileData: file.data});
                }
            });
            var promises = [];
            fileNameList.forEach(element => {
                promises.push(
                save(element.fileData, "../certificates/"+ element.fileName, (err, data) => {
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
    }

    function gen_hash (element) {
        return new Promise((resolve, reject) => {
            var algo = 'md5';
            var shasum = crypto.createHash(algo);
            var file = 'Server/certificates/'+ element.fileName;
            var s = fs.ReadStream(file);
            s.on('end', function() {
                var d = shasum.digest('hex');
                resolve(d);
            });
            s.on('error', reject);
            s.on('data', function(d) { shasum.update(d); });
        });
    }

	return abattoirService;
};

