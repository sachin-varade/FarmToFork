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
    farmer: Farmer;
    purchaseOrderReferenceNumber: string;
    guidGtin: string;
    materialName: string;
    materialGrade: string;
    userByDate: Date;
    quantity: number;
    quantityUnit: string;
    certificates: FarmersCertificate[];
}

