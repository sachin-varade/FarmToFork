export class ProcessorReceived {
    processorId: number;
    processorReceiptNumber: string;
    purchaseOrderNumber: string;
    consignmentNumber: string;
    transportConsitionSatisfied: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    fatCoverClass: string;
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

export class ProcessingTransaction{
    processorId: number
    processorBatchCode: string;
    processorReceiptNumber: string;
    productCode: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    packagingDate: Date;
    usedByDate: Date;    
    quantity: number;
    quantityUnit: string;
    qualityControlDocument: Array<QualityControlDocument> = new Array<QualityControlDocument>();
    storage: string;
    processingAction: Array<ProcessingAction>;
    updatedOn: Date;
    updatedBy: string;  
}

export class QualityControlDocument {
    id: number;
    name: string;
}

export class ProcessingAction{
    action: string;
    doneWhen: Date;
}

export class ProcessorDispatch{
    processorId: number
    processorBatchCode: string;
    consignmentNumber: string;
    ikeaPurchaseOrderNumber: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    temperatureStorageMin: string;
    temperatureStorageMax: string;
    packagingDate: Date;
    usedByDate: Date;    
    dispatchDate: Date;
    quantity: number;
    quantityUnit: string;
    qualityControlDocument: Array<QualityControlDocument> = new Array<QualityControlDocument>();
    storage: string;
    updatedOn: Date;
    updatedBy: string;  
    ikeaId: number;
}
