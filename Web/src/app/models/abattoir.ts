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
    rawMaterialBatchNumber: string;
    guidNumber: string;
    materialName: string;
    materialGrade: string;
    temperatureStorageMin: string;
    temperatureStorageMax: string;
    productionDate: Date;
    usedByDate: Date;
    quantity: number;
    quantityUnit: string;
    updatedOn: Date;
    updatedBy: string;    
}

export class LogisticTransaction {
    logisticId: number;    
    logisticType: string;
    consignmentNumber: string;
    routeId: number;    
    abattoirConsignmentNumber: string;
    vehicleId: number;
    vehicleTypeId: number;
    dispatchDateTime: Date;
    inTransitDateTime: Date;
    expectedDeliveryDateTime: Date;
    actualDeliveryDateTime: Date;
    temperatureStorageMin: string;
    temperatureStorageMax: string;
    quantity: number;
    quantityUnit: string;
    handlingInstruction: string;
    currentStatus: string;
    shipmentStatus: Array<ShipmentStatusTransaction>;
    iotTemperatureHistory: Array<IotHistory>;
    updatedOn: Date;
    updatedBy: string;    
}

export class ShipmentStatusTransaction {
    shipmentStatus: string;    
    shipmentDate: Date;
}

export class IotHistory {
    temperature: string;    
    Location: string;
    updatedOn: Date;
}