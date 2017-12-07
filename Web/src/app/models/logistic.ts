
export class LogisticTransaction {
    logisticId: number;    
    logisticName: string;
    logisticType: string;
    consignmentNumber: string;
    routeId: number;    
    abattoirConsignmentNumber: string;
    processorConsignmentNumber: string;
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