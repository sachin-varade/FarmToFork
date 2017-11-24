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
}
