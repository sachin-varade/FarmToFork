export class Farmer {
    id: number;
    name: string;
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
    rawMaterialBatchNumber: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    userByDate: Date;
    quantity: number;
    quantityUnit: string;
    certificates: FarmersCertificate[];
}

