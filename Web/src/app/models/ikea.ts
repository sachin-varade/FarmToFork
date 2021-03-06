export class IkeaReceived {
    ikeaId: number;
    ikeaReceivedNumber: string;
    purchaseOrderNumber: string;
    consignmentNumber: string;
    transportConsitionSatisfied: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    usedByDate: Date;
    receivedDate: Date;
    quantity: number;
    quantityUnit: string;
    transitTime: string;
    storage: string;
    acceptanceCheckList: Array<AcceptanceCriteria>;
    updatedOn: Date;
    updatedBy: string;  
    reasonForAcceptance: string;  
}

export class AcceptanceCriteria {
    id: number;
    ruleCondition: string;
    conditionSatisfied: boolean;
}

export class IkeaDispatch{
    ikeaId: number
    ikeaDispatchNumber: string;
    ikeaReceivedNumber: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    quantity: number;
    quantityUnit: string;
    dispatchDateTime: Date;
    preparedBy: string;
    soldFromDate: Date;
    soldUntillDate: Date;
    preparedOn: Date;
    soldAt: string;
}

export class IkeaBill{
    restaurantId: number;
    billNumber: string;
    billDateTime: Date;
    ikeaFamily: boolean = false;
    guidUniqueNumber: string;
    materialName: string;
    quantity: number = 0;
    amount: number = 0;
    ikeaDispatchNumber: string;
}

export class ProductTracking{
    BillNumber: string = '';
    IkeaDispatchNumber: string;
    IkeaReceivedNumber: string;
    IkeaStoreName: string;
    MeatBallPreparedDate: Date;
    MeatBallReceivedDate: Date;
    BatchCode: string;

    IkeaPurchaseOrderNumber: string;
    IkeaReceivedDate: Date;
    IkeaReceivedConsignmentNumber: string;
    
    ProcessorToIkeaTransportConsitionSatisfied: string;
    ProcessorToIkeaTransporterName: string;
    ProcessorToIkeaPickUpDate: Date;
    ProcessorToIkeaDeliveryDate: Date;
    ProcessorToIkeaTempDuringTransit: string;
    ProcessorConsignmentNumber: string;

    ProcessorCompanyName: string;
    ProcessingDate: Date;
    ProcessorBatchCode: string;
    ProcessorUseByDate: Date;
    ProcessorReceiptNumber: string;
    ProcessorPurchaseOrderNumber: string;
    AbattoirConsignmentNumber: string;
    
    AbattoirToProcessorTransportConsitionSatisfied: string;
    AbattoirToProcessorTransportConsignemntNumber: string;
    AbattoirToProcessorTransporterName: string;
    AbattoirToProcessorPickUpDate: Date;
    AbattoirToProcessorDeliveryDate: Date;
    AbattoirToProcessorTempDuringTransit: string;
    
    AbattoirName: string;
    AbattoirRawMaterialBatchNumber: string;
    AbattoirProcessDate: Date;
    AbattoirUseByDate: Date;
    AbattoirBatchCode: string;
    AbattoirDispatchMaterialClass: string;

    FarmerName: string;
    FarmerMaterialClass:string;
    ReceiptBatchId: string;
}
