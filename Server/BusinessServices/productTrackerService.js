'use strict';
var entity = require('../Entities/ProductTrackingEntity.js');
var userData;

module.exports = function (abattoirService, logisticService, processorService, ikeaService, userService) {
    var productTrackerService = {};

    // ----- Get Product tracking details
    productTrackerService.getProductTrackingDetails = function(option, value){
        console.log("inside function - getProductTrackingDetails");

        this.userData = userService.getUserData();
        
        var productTrackingEntity = entity.ProductTrackingEntity;
        productTrackingEntity.BillNumber = value;

        //ToDo: Get Ikea Dispatch Number based on Bill Number

        return ikeaService.getIkeaBillDetails(option, value)
        .then((result) => {
        
            return ikeaService.getAllIkeaDispatch("details", value)
            .then((result) => {
            var latestIkeaDispatchNumber = result.ikeaDispatch[0].IkeaDispatchNumber;

        // Ikea Dispatch
        return ikeaService.getAllIkeaDispatch(option, latestIkeaDispatchNumber)
        .then((result) => {
            if(result.ikeaDispatch != undefined && result.ikeaDispatch.length > 0) {
                console.log("IkeaDispatchNumber: ", result.ikeaDispatch[0].IkeaDispatchNumber);
                
                productTrackingEntity.IkeaReceivedNumber = result.ikeaDispatch[0].ikeaReceivedNumber;
                productTrackingEntity.IkeaDispatchNumber = result.ikeaDispatch[0].IkeaDispatchNumber;
                productTrackingEntity.MeatBallPreparedDate = result.ikeaDispatch[0].dispatchDateTime;                
            }

            //Ikea Received
            return ikeaService.getAllIkeaReceived(option, productTrackingEntity.IkeaReceivedNumber)
                .then((result) => {
                    //productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", "1");

                    if (result && result.ikeaReceived &&  result.ikeaReceived.length >0){
                        productTrackingEntity.IkeaStoreName = userService.getUserNameById("ikeas", result.ikeaReceived[0].ikeaId);
                        
                        productTrackingEntity.IkeaReceivedDate = result.ikeaReceived[0].receivedDate;
                        productTrackingEntity.IkeaReceivedConsignmentNumber = result.ikeaReceived[0].consignmentNumber;
                        productTrackingEntity.IkeaPurchaseOrderNumber = result.ikeaReceived[0].purchaseOrderNumber;                        
                        productTrackingEntity.ProcessorToIkeaTransportConsitionSatisfied = result.ikeaReceived[0].transportConsitionSatisfied;                        
                    }       
                    
                    // Logistics - Processor to Ikea
                    return logisticService.getAllLogisticP2ITransactions(option, productTrackingEntity.IkeaReceivedConsignmentNumber)
                    .then((result) => {
                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                            productTrackingEntity.ProcessorToIkeaTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                            productTrackingEntity.ProcessorToIkeaPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                            productTrackingEntity.ProcessorToIkeaDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                            productTrackingEntity.ProcessorConsignmentNumber = result.logisticTransactions[0].processorConsignmentNumber;                            
                        }

                        // Processor Dispatch
                        return processorService.getAllProcessorDispatch(option, productTrackingEntity.ProcessorConsignmentNumber)
                        .then((result) => {
                            if (result && result.processorDispatch &&  result.processorDispatch.length >0){
                                productTrackingEntity.ProcessorUseByDate = result.processorDispatch[0].usedByDate;
                                productTrackingEntity.ProcessorBatchCode = result.processorDispatch[0].processorBatchCode;
                            }

                            //Processor Transaction
                            return processorService.getAllProcessingTransactions(option, productTrackingEntity.ProcessorBatchCode)
                            .then((result) => {
                                if (result && result.processingTransaction &&  result.processingTransaction.length >0){
                                    productTrackingEntity.ProcessingDate = result.processingTransaction[0].updatedOn;
                                    productTrackingEntity.ProcessorReceiptNumber = result.processingTransaction[0].processorReceiptNumber;
                                }

                                // Processor Received
                                return processorService.getAllProcessorReceived(option, productTrackingEntity.ProcessorReceiptNumber)
                                .then((result) => {
                                    if (result && result.processorReceived &&  result.processorReceived.length >0){
                                        productTrackingEntity.ProcessorCompanyName = userService.getUserNameById("processors", result.processorReceived[0].processorId);
                                        productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.processorReceived[0].consignmentNumber;
                                        productTrackingEntity.ProcessorPurchaseOrderNumber = result.processorReceived[0].purchaseOrderNumber;
                                        productTrackingEntity.AbattoirToProcessorTransportConsitionSatisfied =  result.processorReceived[0].transportConsitionSatisfied;
                                    }

                                    // Logistics Abattoir to Processor
                                    return logisticService.getAllLogisticA2PTransactions(option, productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber)
                                    .then((result) => {
                                        if (result && result.logisticTransactions &&  result.logisticTransactions.length >0){
                                            productTrackingEntity.AbattoirToProcessorTransporterName = userService.getUserNameById("logistics", result.logisticTransactions[0].logisticId);
                                            productTrackingEntity.AbattoirToProcessorTransportConsignemntNumber = result.logisticTransactions[0].consignmentNumber;
                                            
                                            productTrackingEntity.AbattoirToProcessorPickUpDate = result.logisticTransactions[0].dispatchDateTime;
                                            productTrackingEntity.AbattoirToProcessorDeliveryDate = result.logisticTransactions[0].actualDeliveryDateTime;
                                            productTrackingEntity.AbattoirConsignmentNumber = result.logisticTransactions[0].abattoirConsignmentNumber;
                                        }

                                        // Abattoir Dispatch
                                        return abattoirService.getAllAbattoirDispatch(option, productTrackingEntity.AbattoirConsignmentNumber)
                                        .then((result) => {
                                            if (result && result.abattoirMaterialDispatch &&  result.abattoirMaterialDispatch.length >0){
                                                productTrackingEntity.AbattoirBatchCode = result.abattoirMaterialDispatch[0].consignmentNumber;
                                                productTrackingEntity.AbattoirUseByDate = result.abattoirMaterialDispatch[0].usedByDate;
                                                productTrackingEntity.AbattoirProcessDate = result.abattoirMaterialDispatch[0].updatedOn;
                                                productTrackingEntity.AbattoirRawMaterialBatchNumber = result.abattoirMaterialDispatch[0].rawMaterialBatchNumber;
                                                productTrackingEntity.AbattoirDispatchMaterialClass = result.abattoirMaterialDispatch[0].materialGrade;
                                                productTrackingEntity.AbbattoirPurchaseOrderReferenceNumber = result.abattoirMaterialDispatch[0].purchaseOrderReferenceNumber;
                                            }

                                            // Abattoir Received
                                            return abattoirService.getAllAbattoirReceived(option, productTrackingEntity.AbbattoirPurchaseOrderReferenceNumber)
                                            .then((result) => {
                                                if (result && result.abattoirMaterialReceived &&  result.abattoirMaterialReceived.length >0){
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
            return productTrackingEntity;
        }).catch((err) => {
            console.error("Error while getting P2I logistics details")
            throw err;
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