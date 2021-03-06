'use strict';
var entity = require('../Entities/ProductTrackingEntity.js');
var userData;

module.exports = function (abattoirService, logisticService, processorService, ikeaService, userService) {
    var productTrackerService = {};


    productTrackerService.getIkeaProductTrackingDetails = function(option, value){
        this.userData = userService.getUserData();
        var productTrackingEntity = entity.ProductTrackingEntity;

        productTrackingEntity.BillNumber = value;
        return ikeaService.getAllIkeaDispatch(option, value)
        .then((result) => {
            if(result.ikeaDispatch != undefined && result.ikeaDispatch.length > 0) {
                console.log("IkeaDispatchNumber: ", result.ikeaDispatch[0].IkeaDispatchNumber);
                productTrackingEntity.ikeaDispatch = result.ikeaDispatch[0];
                productTrackingEntity.IkeaReceivedNumber = result.ikeaDispatch[0].ikeaReceivedNumber;
                productTrackingEntity.IkeaDispatchNumber = result.ikeaDispatch[0].IkeaDispatchNumber;
                productTrackingEntity.MeatBallPreparedDate = result.ikeaDispatch[0].dispatchDateTime;                
            }
            else{
                return;
            }

            return ikeaService.getIkeaBillDetails("ikeacheckout", productTrackingEntity.IkeaDispatchNumber)
            .then((result) => {
                if(!result || (result && !result.ikeaBillNumbers) || (result && result.ikeaBillNumbers.length == 0 )){
                    productTrackingEntity.ikeaDispatch.soldFromDate = "";
                    productTrackingEntity.ikeaDispatch.soldUntillDate =  "";    
                }
                else{
                    productTrackingEntity.ikeaDispatch.soldFromDate = result.ikeaBillNumbers[0].billDateTime;
                    productTrackingEntity.ikeaDispatch.soldUntillDate =  result.ikeaBillNumbers[result.ikeaBillNumbers.length-1].billDateTime;
                    if(result.ikeaBillNumbers[0].restaurantId){
                        productTrackingEntity.soldAt = this.userData.users.ikeas.filter(function(o){return o.id.toString() == result.ikeaBillNumbers[0].restaurantId.toString()})[0].storeName;
                    }                     
                }
            
                
            //Ikea Received
            return ikeaService.getAllIkeaReceived(option, productTrackingEntity.IkeaReceivedNumber)
                .then((result) => {
                    //productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", "1");

                    if (result && result.ikeaReceived &&  result.ikeaReceived.length >0){
                        productTrackingEntity.ikeaReceived = result.ikeaReceived[0];
                        productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", result.ikeaReceived[0].ikeaId);
                        
                        productTrackingEntity.IkeaReceivedDate = result.ikeaReceived[0].receivedDate;
                        productTrackingEntity.IkeaReceivedConsignmentNumber = result.ikeaReceived[0].consignmentNumber;
                        productTrackingEntity.IkeaPurchaseOrderNumber = result.ikeaReceived[0].purchaseOrderNumber;                        
                        productTrackingEntity.ProcessorToIkeaTransportConsitionSatisfied = result.ikeaReceived[0].transportConsitionSatisfied;                        
                    }       
                    else{
                        return;
                    }
                    // Logistics - Processor to Ikea
                    return logisticService.getAllLogisticP2ITransactions(option, productTrackingEntity.IkeaReceivedConsignmentNumber)
                    .then((result) => {
                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                            productTrackingEntity.logisticP2ITransactions = result.logisticTransactions[0];
                            productTrackingEntity.ProcessorToIkeaTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                            productTrackingEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                            productTrackingEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                            productTrackingEntity.ProcessorConsignmentNumber = result.logisticTransactions[0].processorConsignmentNumber;                            
                        }
                        else{
                            return;
                        }
                        // Processor Dispatch
                        return processorService.getAllProcessorDispatch(option, productTrackingEntity.ProcessorConsignmentNumber)
                        .then((result) => {
                            if (result && result.processorDispatch &&  result.processorDispatch.length >0){
                                productTrackingEntity.processorDispatch = result.processorDispatch[0];
                                productTrackingEntity.ProcessorUseByDate = result.processorDispatch[0].usedByDate;
                                productTrackingEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
                            }
                            else{
                                return;
                            }
                            //Processor Transaction
                            return processorService.getAllProcessingTransactions(option, productTrackingEntity.ProcessorBatchCode)
                            .then((result) => {
                                if (result && result.processingTransaction &&  result.processingTransaction.length >0){
                                    productTrackingEntity.processingTransaction = result.processingTransaction[0];
                                    productTrackingEntity.ProcessingDate = result.processingTransaction[0].updatedOn;
                                    productTrackingEntity.ProcessorReceiptNumber = result.processingTransaction[0].processorReceiptNumber;
                                }
                                else{
                                    return;
                                }
                                // Processor Received
                                return processorService.getAllProcessorReceived(option, productTrackingEntity.ProcessorReceiptNumber)
                                .then((result) => {
                                    if (result && result.processorReceived &&  result.processorReceived.length >0){
                                        productTrackingEntity.processorReceived = result.processorReceived[0];
                                        productTrackingEntity.ProcessorCompanyName = userService.getUserNameById("processors", result.processorReceived[0].processorId);
                                        productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.processorReceived[0].consignmentNumber;
                                        productTrackingEntity.ProcessorPurchaseOrderNumber = result.processorReceived[0].purchaseOrderNumber;
                                        productTrackingEntity.AbattoirToProcessorTransportConsitionSatisfied =  result.processorReceived[0].transportConsitionSatisfied;
                                    }
                                    else{
                                        return;
                                    }
                                    // Logistics Abattoir to Processor
                                    return logisticService.getAllLogisticA2PTransactions(option, productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber)
                                    .then((result) => {
                                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                                            productTrackingEntity.logisticA2PTransactions = result.logisticTransactions[0];
                                            productTrackingEntity.AbattoirToProcessorTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                                            productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.logisticTransactions[0].consignmentNumber;
                                            
                                            productTrackingEntity.AbattoirToProcessorPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                                            productTrackingEntity.AbattoirToProcessorDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                                            productTrackingEntity.AbattoirConsignmentNumber = result.logisticTransactions[0].abattoirConsignmentNumber;
                                        }
                                        else{
                                            return;
                                        }
                                        // Abattoir Dispatch
                                        return abattoirService.getAllAbattoirDispatch(option, productTrackingEntity.AbattoirConsignmentNumber)
                                        .then((result) => {
                                            if (result && result.abattoirMaterialDispatch &&  result.abattoirMaterialDispatch.length >0){
                                                productTrackingEntity.abattoirMaterialDispatch = result.abattoirMaterialDispatch[0];
                                                productTrackingEntity.AbattoirBatchCode = result.abattoirMaterialDispatch[0].consignmentNumber;
                                                productTrackingEntity.AbattoirUseByDate = result.abattoirMaterialDispatch[0].usedByDate;
                                                productTrackingEntity.AbattoirProcessDate = result.abattoirMaterialDispatch[0].updatedOn;
                                                productTrackingEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialDispatch[0].rawMaterialBatchNumber;
                                                productTrackingEntity.AbattoirDispatchMaterialClass = result.abattoirMaterialDispatch[0].materialGrade;
                                                productTrackingEntity.AbbattoirPurchaseOrderReferenceNumber = result.abattoirMaterialDispatch[0].purchaseOrderReferenceNumber;
                                                productTrackingEntity.ReceiptBatchId = result.abattoirMaterialDispatch[0].receiptBatchId;
                                            }
                                            else{
                                                return;
                                            }
                                            // Abattoir Received
                                            return abattoirService.getAllAbattoirReceived(option, productTrackingEntity.ReceiptBatchId)
                                            .then((result) => {
                                                if (result && result.abattoirMaterialReceived &&  result.abattoirMaterialReceived.length >0){
                                                    productTrackingEntity.abattoirMaterialReceived = result.abattoirMaterialReceived[0];
                                                    productTrackingEntity.AbattoirName = userService.getUserNameById("abattoirs", result.abattoirMaterialReceived[0].abattoirId);
                                                    
                                                    productTrackingEntity.FarmerName = userService.getUserNameById("farmers", result.abattoirMaterialReceived[0].farmerId);
                                                    productTrackingEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialReceived[0].rawMaterialBatchNumber;
                                                    productTrackingEntity.FarmerMaterialClass = result.abattoirMaterialReceived[0].materialGrade;
                                                    productTrackingEntity.ReceiptBatchId = result.abattoirMaterialReceived[0].receiptBatchId;
                                                }
                                                return productTrackingEntity;
                                            });                                            
                                        });
                                    });
                                });
                            });
                        })
                    });
                });
            
            
            });
        });
        
    }
    // ----- Get Product tracking details
    productTrackerService.getProductTrackingDetails = function(option, value){
        console.log("inside function - getProductTrackingDetails");

        this.userData = userService.getUserData();
        
        var productTrackingEntity = entity.ProductTrackingEntity;
        productTrackingEntity.BillNumber = value;

        //ToDo: Get Ikea Dispatch Number based on Bill Number

        return ikeaService.getIkeaBillDetails(option, value)
        .then((result) => {
            if(!result || (result && !result.ikeaBillNumbers) || (result && result.ikeaBillNumbers.length == 0 )){
                return;
            }
            if(result.ikeaBillNumbers[0].restaurantId){
                productTrackingEntity.soldAt = this.userData.users.ikeas.filter(function(o){return o.id.toString() == result.ikeaBillNumbers[0].restaurantId.toString()})[0].storeName;
            } 
            productTrackingEntity.billDetails = result.ikeaBillNumbers[0];
            var latestIkeaDispatchNumber = result.ikeaBillNumbers[0].ikeaDispatchNumber;
            // return ikeaService.getAllIkeaDispatch("details","")
            // .then((result) => {
            //     if(result.ikeaDispatch.length>0){
            //         latestIkeaDispatchNumber = result.ikeaDispatch[result.ikeaDispatch.length-1].IkeaDispatchNumber;
            //     }
            //     else{
            //         return;
            //     }
            
        // Ikea Dispatch
        return ikeaService.getAllIkeaDispatch(option, latestIkeaDispatchNumber)
        .then((result) => {
            if(result.ikeaDispatch != undefined && result.ikeaDispatch.length > 0) {
                console.log("IkeaDispatchNumber: ", result.ikeaDispatch[0].IkeaDispatchNumber);
                productTrackingEntity.ikeaDispatch = result.ikeaDispatch[0];
                productTrackingEntity.IkeaReceivedNumber = result.ikeaDispatch[0].ikeaReceivedNumber;
                productTrackingEntity.IkeaDispatchNumber = result.ikeaDispatch[0].IkeaDispatchNumber;
                productTrackingEntity.MeatBallPreparedDate = result.ikeaDispatch[0].dispatchDateTime;                
            }
            else{
                return;
            }

            //Ikea Received
            return ikeaService.getAllIkeaReceived(option, productTrackingEntity.IkeaReceivedNumber)
                .then((result) => {
                    //productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", "1");

                    if (result && result.ikeaReceived &&  result.ikeaReceived.length >0){
                        productTrackingEntity.ikeaReceived = result.ikeaReceived[0];
                        productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", result.ikeaReceived[0].ikeaId);
                        
                        productTrackingEntity.IkeaReceivedDate = result.ikeaReceived[0].receivedDate;
                        productTrackingEntity.IkeaReceivedConsignmentNumber = result.ikeaReceived[0].consignmentNumber;
                        productTrackingEntity.IkeaPurchaseOrderNumber = result.ikeaReceived[0].purchaseOrderNumber;                        
                        productTrackingEntity.ProcessorToIkeaTransportConsitionSatisfied = result.ikeaReceived[0].transportConsitionSatisfied;                        
                    }       
                    else{
                        return;
                    }
                    // Logistics - Processor to Ikea
                    return logisticService.getAllLogisticP2ITransactions(option, productTrackingEntity.IkeaReceivedConsignmentNumber)
                    .then((result) => {
                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                            productTrackingEntity.logisticP2ITransactions = result.logisticTransactions[0];
                            productTrackingEntity.ProcessorToIkeaTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                            productTrackingEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                            productTrackingEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                            productTrackingEntity.ProcessorConsignmentNumber = result.logisticTransactions[0].processorConsignmentNumber;                            
                        }
                        else{
                            return;
                        }
                        // Processor Dispatch
                        return processorService.getAllProcessorDispatch(option, productTrackingEntity.ProcessorConsignmentNumber)
                        .then((result) => {
                            if (result && result.processorDispatch &&  result.processorDispatch.length >0){
                                productTrackingEntity.processorDispatch = result.processorDispatch[0];
                                productTrackingEntity.ProcessorUseByDate = result.processorDispatch[0].usedByDate;
                                productTrackingEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
                            }
                            else{
                                return;
                            }
                            //Processor Transaction
                            return processorService.getAllProcessingTransactions(option, productTrackingEntity.ProcessorBatchCode)
                            .then((result) => {
                                if (result && result.processingTransaction &&  result.processingTransaction.length >0){
                                    productTrackingEntity.processingTransaction = result.processingTransaction[0];
                                    productTrackingEntity.ProcessingDate = result.processingTransaction[0].updatedOn;
                                    productTrackingEntity.ProcessorReceiptNumber = result.processingTransaction[0].processorReceiptNumber;
                                }
                                else{
                                    return;
                                }
                                // Processor Received
                                return processorService.getAllProcessorReceived(option, productTrackingEntity.ProcessorReceiptNumber)
                                .then((result) => {
                                    if (result && result.processorReceived &&  result.processorReceived.length >0){
                                        productTrackingEntity.processorReceived = result.processorReceived[0];
                                        productTrackingEntity.ProcessorCompanyName = userService.getUserNameById("processors", result.processorReceived[0].processorId);
                                        productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.processorReceived[0].consignmentNumber;
                                        productTrackingEntity.ProcessorPurchaseOrderNumber = result.processorReceived[0].purchaseOrderNumber;
                                        productTrackingEntity.AbattoirToProcessorTransportConsitionSatisfied =  result.processorReceived[0].transportConsitionSatisfied;
                                    }
                                    else{
                                        return;
                                    }
                                    // Logistics Abattoir to Processor
                                    return logisticService.getAllLogisticA2PTransactions(option, productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber)
                                    .then((result) => {
                                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                                            productTrackingEntity.logisticA2PTransactions = result.logisticTransactions[0];
                                            productTrackingEntity.AbattoirToProcessorTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                                            productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.logisticTransactions[0].consignmentNumber;
                                            
                                            productTrackingEntity.AbattoirToProcessorPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                                            productTrackingEntity.AbattoirToProcessorDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                                            productTrackingEntity.AbattoirConsignmentNumber = result.logisticTransactions[0].abattoirConsignmentNumber;
                                        }
                                        else{
                                            return;
                                        }
                                        // Abattoir Dispatch
                                        return abattoirService.getAllAbattoirDispatch(option, productTrackingEntity.AbattoirConsignmentNumber)
                                        .then((result) => {
                                            if (result && result.abattoirMaterialDispatch &&  result.abattoirMaterialDispatch.length >0){
                                                productTrackingEntity.abattoirMaterialDispatch = result.abattoirMaterialDispatch[0];
                                                productTrackingEntity.AbattoirBatchCode = result.abattoirMaterialDispatch[0].consignmentNumber;
                                                productTrackingEntity.AbattoirUseByDate = result.abattoirMaterialDispatch[0].usedByDate;
                                                productTrackingEntity.AbattoirProcessDate = result.abattoirMaterialDispatch[0].updatedOn;
                                                productTrackingEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialDispatch[0].rawMaterialBatchNumber;
                                                productTrackingEntity.AbattoirDispatchMaterialClass = result.abattoirMaterialDispatch[0].materialGrade;
                                                productTrackingEntity.AbbattoirPurchaseOrderReferenceNumber = result.abattoirMaterialDispatch[0].purchaseOrderReferenceNumber;
                                                productTrackingEntity.ReceiptBatchId = result.abattoirMaterialDispatch[0].receiptBatchId;
                                            }
                                            else{
                                                return;
                                            }
                                            // Abattoir Received
                                            return abattoirService.getAllAbattoirReceived(option, productTrackingEntity.ReceiptBatchId)
                                            .then((result) => {
                                                if (result && result.abattoirMaterialReceived &&  result.abattoirMaterialReceived.length >0){
                                                    productTrackingEntity.abattoirMaterialReceived = result.abattoirMaterialReceived[0];
                                                    productTrackingEntity.AbattoirName = userService.getUserNameById("abattoirs", result.abattoirMaterialReceived[0].abattoirId);
                                                    
                                                    productTrackingEntity.FarmerName = userService.getUserNameById("farmers", result.abattoirMaterialReceived[0].farmerId);
                                                    productTrackingEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialReceived[0].rawMaterialBatchNumber;
                                                    productTrackingEntity.FarmerMaterialClass = result.abattoirMaterialReceived[0].materialGrade;
                                                    productTrackingEntity.ReceiptBatchId = result.abattoirMaterialReceived[0].receiptBatchId;
                                                }
                                                return productTrackingEntity;
                                            });                                            
                                        });
                                    });
                                });
                            });
                        })
                    // });
                });
            });
        });
            return productTrackingEntity;
        }).catch((err) => {
            console.error("Error while getting P2I logistics details")
            //throw err;
        });

        

        //    return processorService.getAllProcessorDispatch(option, "")
        //         .then((result) => {
        //             if (result && result.processorDispatch &&  result.processorDispatch.length >0){
        //                 productTrackingEntity.ProcessorUseByDate = result.processorDispatch[0].UsedByDate;
        //                 productTrackingEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
        //             }
        //             return productTrackingEntity;                    
        //         })
        //         .catch((err) => {
        //             throw err;
        //         })

        //         //Ikea Received
        //         ikeaService.getAllIkeaReceived(option, productTrackingEntity.IkeaReceivedNumber)
        //             .then((result) => {
        //                 productTrackingEntity.IkeaReceivedDate = result.ikeaReceived[0].receivedDate;
        //                 productTrackingEntity.IkeaReceivedConsignmentNumber = result.ikeaReceived[0].consignmentNumber;
        //                 productTrackingEntity.IkeaPurchaseOrderNumber = result.ikeaReceived[0].purchaseOrderNumber;
        //             });

        //         // Logistics Processor to Ikea
        //         logisticService.getAllLogisticP2ITransactions(option, productTrackingEntity.IkeaReceivedConsignmentNumber)
        //             .then((result) => {
        //                 productTrackingEntity.ProcessorToIkeaTransporterName = result.logisticTransactions[0].logisticId;
        //                 productTrackingEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
        //                 productTrackingEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
        //             });

        //             // Processor dispatch
        //         processorService.getAllProcessorDispatch(option, productTrackingEntity.IkeaPurchaseOrderNumber)
        //             .then((result) => {
        //                 productTrackingEntity.ProcessorUseByDate = result.processorDispatch[0].UsedByDate;
        //                 productTrackingEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
        //             });

        //             // Processor Transaction
        //         processorService.getAllProcessingTransactions(option, productTrackingEntity.ProcessorBatchCode)
        //         .then((result) => {
        //             productTrackingEntity.ProcessingDate = result.processingTransaction[0].updatedOn;
        //             productTrackingEntity.ProcessorReceiptNumber = result.processingTransaction[0].processorReceiptNumber;
        //         });

        //         // Processor Received
        //         processorService.getAllProcessorReceived(option, productTrackingEntity.ProcessorReceiptNumber)
        //         .then((result) => {
        //             productTrackingEntity.ProcessorCompanyName = result.processorReceived[0].processorId;
        //             productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.processorReceived[0].consignmentNumber;
        //             productTrackingEntity.ProcessorPurchaseOrderNumber = result.processorReceived[0].purchaseOrderNumber;
        //         });

        //         // Logistics Abattoir to Processor
        //         logisticService.getAllLogisticA2PTransactions(option, productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber)
        //         .then((result) => {
        //             productTrackingEntity.AbattoirToProcessorTransporterName = result.logisticTransactions[0].logisticId;
        //             productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.logisticTransactions[0].consignmentNumber;
        //             productTrackingEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
        //             productTrackingEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
        //             productTrackingEntity.AbattoirConsignmentNumber = result.logisticTransactions[0].abattoirConsignmentNumber;
        //         });

        //         // Abattoir Dispatch
        //         abattoirService.getAllAbattoirDispatch(option, productTrackingEntity.AbattoirConsignmentNumber)
        //         .then((result) => {
        //             productTrackingEntity.AbattoirBatchCode = result.AbattoirMaterialDispatch[0].logisticId;
        //             productTrackingEntity.AbattoirUseByDate = result.AbattoirMaterialDispatch[0].consignmentNumber;
        //             productTrackingEntity.AbattoirProcessDate = result.AbattoirMaterialDispatch[0].dispatchDateTime;
        //             productTrackingEntity.AbattoirRawMaterialBatchNumber = result.AbattoirMaterialDispatch[0].rawMaterialBatchNumber;
        //         });

        //         // Abattoir Received
        //         abattoirService.getAllAbattoirReceived(option, productTrackingEntity.AbattoirRawMaterialBatchNumber)
        //         .then((result) => {
        //             productTrackingEntity.AbattoirName = result.AbattoirMaterialReceived[0].abattoirId;
        //             productTrackingEntity.FarmerId = result.AbattoirMaterialReceived[0].farmerId;
        //             productTrackingEntity.AbattoirPurchaseOrderReferenceNumber = result.AbattoirMaterialReceived[0].purchaseOrderReferenceNumber;
        //         });
            
        //     }

        // // //    return abattoirService.getAllAbattoirReceived(option, productTrackingEntity.AbattoirRawMaterialBatchNumber)
        // // //         .then((result) => {
        // // //             productTrackingEntity.AbattoirName = "";
        // // //             productTrackingEntity.FarmerId = "";
        // // //             productTrackingEntity.AbattoirPurchaseOrderReferenceNumber = "";

        // // //             return productTrackingEntity;
        // // //         })
        // // //         .catch((err) => {
        // // //             throw err;
        // // //         })
            

         

        
        // // ikeaService.getAllIkeaReceived(option, value)
        // //     .then((result) => {
        // //         if(result.ikeaReceived != undefined && result.ikeaReceived.length > 0) {
        // //             console.log("ikeaReceivedNumber: ", result.ikeaReceived[0].ikeaReceivedNumber);

        // //             productTrackingEntity.IkeaStoreName = result.ikeaReceived[0].ikeaStoreId;
        // //         }
        // //         return productTrackingEntity;                
        // //     }).then((results) => {
        // //         return results;
        // //     }).catch((err) => {
        // //         throw err;
        // // })

        // abattoirService.getAllAbattoirReceived(option, value)
        // .then((results) => {
        //     return results;
        // });

        //return output;        
    }

    return productTrackerService;
};