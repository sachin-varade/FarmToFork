export class Farmer {
    id: number;
    name: string;
    displayName: string;
    role: string;
    uniqueId: string;
}

export class Logistic {
    id: number;
    name: string;
    displayName: string;
    role: string;
    uniqueId: string;
}

export class FarmersCertificate {
    id: number;
    name: string;
}

export class AbattoirReceived {
    abattoirId: number;
    farmer: Farmer = new Farmer();
    purchaseOrderReferenceNumber: string;
    receiptBatchId: string;
    receiptOn: Date;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    usedByDate: Date;
    quantity: number;
    quantityUnit: string;
    certificates: FarmersCertificate[];
    updatedOn: Date;
    updatedBy: string;    
}

export class AbattoirDispatch {
    abattoirId: number;    
    consignmentNumber: string;
    purchaseOrderReferenceNumber: string;
    receiptBatchId: string;
    dispatchDate: Date;
    logistic: Logistic = new Logistic();
    salesOrder: string;

    guidNumber: string;
    materialName: string;
    materialGrade: string;
    fatCoverClass: string;
    
    temperatureStorageMin: string;
    temperatureStorageMax: string;
    productionDate: Date;
    usedByDate: Date;
    quantity: number;
    quantityUnit: string;
    updatedOn: Date;
    updatedBy: string;    
}