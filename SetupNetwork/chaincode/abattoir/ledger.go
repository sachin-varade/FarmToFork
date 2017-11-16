/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

package main

import (
	"fmt"
	"encoding/json"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)
// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode - %s", err)
	}
}

// Part tracker start


// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type AbattoirMaterialReceived struct {
	AbattoirId			string	`json:"abattoirId"`
	PurchaseOrderReferenceNumber	string	`json:"purchaseOrderReferenceNumber"`
	RawMaterialBatchNumber	string	`json:"rawMaterialBatchNumber"`	
	FarmerId			string	`json:"farmerId"`	
	GUIDNumber			string	`json:"guidNumber"`
	MaterialName		string	`json:"materialName"`
	MaterialGrade		string	`json:"materialGrade"`
	UseByDate			string	`json:"useByDate"`
	Quantity			string	`json:"quantity"`
	QuantityUnit			string	`json:"quantityUnit"`	
	Certificates		[]FarmersCertificate	`json:"certificates"`
}

type FarmersCertificate struct {
	Id			string	`json:"id"`	
	Name			string	`json:"name"`
}

type AbattoirDispatch struct {
	AbattoirId				string	`json:"abattoirId"`
	ConsignmentNumber		string	`json:"consignmentNumber"`
	PurchaseOrderReferenceNumber		string	`json:"purchaseOrderReferenceNumber"`
	RawMaterialBatchNumber				string	`json:"rawMaterialBatchNumber"`
	GUIDNumber				string	`json:"guidNumber"`
	MaterialName			string	`json:"materialName"`
	MaterialGrade			string	`json:"materialGrade"`
	TemperatureStorageMin	string	`json:"temperatureStorageMin"`
	TemperatureStorageMax	string	`json:"temperatureStorageMax"`
	ProductionDate			string	`json:"productionDate"`
	UseByDate				string	`json:"useByDate"`
	Quantity				string	`json:"quantity"`	
	QuantityUnit				string	`json:"quantityUnit"`	
}

type LogisticTransaction struct {	
	ConsignmentNumber				string	`json:"consignmentNumber"`
	LogisticProviderId				string	`json:"logisticProviderId"`
	LogisticType					string	`json:"logisticType"`
	RouteId							string	`json:"RouteId"`
	AbattoirConsignmentId			string	`json:"AbattoirConsignmentId"`
	VehicleId						string	`json:"vehicleId"`
	VehicleType						string	`json:"vehicleType"`
	PickupDateTime					string	`json:"pickupDateTime"`
	ExpectedDeliveryDateTime		string	`json:"expectedDeliveryDateTime"`
	ActualDeliveryDateTime			string	`json:"actualDeliveryDateTime"`
	TemperatureStorageMin			string	`json:"temperatureStorageMin"`
	TemperatureStorageMax			string	`json:"temperatureStorageMax"`
	Quantity						string	`json:"quantity"`	
	HandlingInstruction				string	`json:"handlingInstruction"`
	ShipmentStatus					[]ShipmentStatusTransaction	`json:"shipmentStatus"`
	IotTemperatureHistory			[]IotHistory `json:"iotTemperatureHistory"`
}

type ShipmentStatusTransaction struct {
	ShipmentStatus 			string 	`json:"shipmentStatus"`
	ShipmentDate 			string  `json:"shipmentDate"`
}

type IotHistory struct {
	Temperature	string `json:"temperature"`
	Location	string `json:"location"`
}


type Part struct {
	PartId 			string 	`json:"partId"`
	PartCode 		string  `json:"partCode"`
	BatchCode 		string  `json:"batchCode"`
	PartType 		string  `json:"partType"`
	PartName 		string  `json:"partName"`
	QRCode 		string  `json:"qrcode"`
	Description 		string  `json:"description"`
	Transactions		[]Transaction `json:"transactions"`
}

// PART TRANSACTION HISTORY
type Transaction struct {
	User  			string  `json:"user"`
	DateOfManufacture	string  `json:"dateOfManufacture"`
	DateOfDelivery		string	`json:"dateOfDelivery"`
	DateOfInstallation	string	`json:"dateOfInstallation"`
	VehicleId		string	`json:"vehicleId"`
	Vin		string	`json:"vin"`
	WarrantyStartDate	string	`json:"warrantyStartDate"`
	WarrantyEndDate		string	`json:"warrantyEndDate"`
	TType 			string   `json:"ttype"`
}

//==============================================================================================================================
//				Used as an index when querying all parts.
//==============================================================================================================================
type AllParts struct{
	Parts []string `json:"parts"`
}

type AllPartDetails struct{
	Parts []Part `json:"parts"`
}

type AllAbattoirReceivedIds struct{
	PurchaseOrderReferenceNumbers []string `json:"purchaseOrderReferenceNumbers"`
}
type AllAbattoirReceivedDetails struct{
	AbattoirMaterialReceived []AbattoirMaterialReceived `json:"abattoirMaterialReceived"`
}

type AllAbattoirDispatchIds struct{
	ConsignmentNumbers []string `json:"consignmentNumbers"`
}

type AllAbattoirDispatchDetails struct{
	AbattoirMaterialDispatch []AbattoirDispatch `json:"abattoirMaterialDispatch"`
}

type AllLogisticTransactions struct{
	LogisticTransactionList []LogisticTransaction `json:"LogisticTransactionList"`
}

// Part tracker end

// ============================================================================================================================
// Init - initialize the chaincode 
//
// Shows off PutState() and how to pass an input argument to chaincode.
//
// Inputs - Array of strings
// 
// Returns - shim.Success or error
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("App Is Starting Up")
	_, args := stub.GetFunctionAndParameters()
	var err error
	
	fmt.Println("Init() args count:", len(args))
	fmt.Println("Init() args found:", args)

	// expecting 1 arg for instantiate or upgrade
	if len(args) == 1 {
		fmt.Println("Init() arg[0] length", len(args[0]))

		// expecting arg[0] to be length 0 for upgrade
		if len(args[0]) == 0 {
			fmt.Println("args[0] is empty... must be upgrading")
		} else {
			fmt.Println("args[0] is not empty, must be instantiating")
		}
	}

	// Part Tracker start
	var parts AllParts

	jsonAsBytesParts, _ := json.Marshal(parts)
	err = stub.PutState("allParts", jsonAsBytesParts)
	if err != nil {
		//return nil, err
		return shim.Error(err.Error())
	}

	var allAbattoirReceivedIds AllAbattoirReceivedIds

	jsonAsBytesPurchaseOrderReferenceNumbers, _ := json.Marshal(allAbattoirReceivedIds)
	err = stub.PutState("allAbattoirReceivedIds", jsonAsBytesPurchaseOrderReferenceNumbers)
	if err != nil {
		//return nil, err
		return shim.Error(err.Error())
	}
	
	var allAbattoirDispatchIds AllAbattoirDispatchIds
	
	jsonAsBytesAllAbattoirDispatchIds, _ := json.Marshal(allAbattoirDispatchIds)
	err = stub.PutState("allAbattoirDispatchIds", jsonAsBytesAllAbattoirDispatchIds)
	if err != nil {
		//return nil, err
		return shim.Error(err.Error())
	}
	
	var allLogisticTransactions AllLogisticTransactions
	
	jsonAsBytesAllLogisticTransactions, _ := json.Marshal(allLogisticTransactions)
	err = stub.PutState("allLogisticTransactions", jsonAsBytesAllLogisticTransactions)
	if err != nil {
		//return nil, err
		return shim.Error(err.Error())
	}


	// Part tracker end
	fmt.Println(" - ready for action")                          //self-test pass
	return shim.Success(nil)
}


// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println(" ")
	fmt.Println("starting invoke, for - " + function)

	// Handle different functions
	if function == "init" {                    //initialize the chaincode state, used as reset
		return t.Init(stub)
	} else if function == "read" {             //generic read ledger
		return read(stub, args)
	} else if function == "getPart" { 
		return getPart(stub, args[0])
	} else if function == "getAllParts" { 
		return getAllParts(stub, args[0])
	} else if function == "createPart" {			//create a part
		return createPart(stub, args)	
	} else if function == "updatePart" {			//create a part
		return updatePart(stub, args)	
	} else if function == "getAllPartDetails" {			//create a part
		return getAllPartDetails(stub, args[0],args[1])	
	} else if function == "getAllAbattoirReceived" {
		return getAllAbattoirReceived(stub, args[0])	
	} else if function == "saveAbattoirReceived" {
		return saveAbattoirReceived(stub, args)
	} else if function == "getAllAbattoirDispatch" {
		return getAllAbattoirDispatch(stub, args[0])
	} else if function == "saveAbattoirDispatch" {
		return saveAbattoirDispatch(stub, args)
	} else if function == "getAllLogisticTransactions" {
		return getAllLogisticTransactions(stub, args[0])
	} else if function == "createLogisticTransaction" {
		return createLogisticTransaction(stub, args)
	} else if function == "updateLogisticTransactionStatus" {
		return updateLogisticTransactionStatus(stub, args)
	} else if function == "pushIotDetailsToLogisticTransaction" {
		return pushIotDetailsToLogisticTransaction(stub, args)
	}
	

	// error out
	fmt.Println("Received unknown invoke function name - " + function)
	return shim.Error("Received unknown invoke function name - '" + function + "'")
}


// ============================================================================================================================
// Query - legacy function
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Error("Unknown supported call - Query()")
}
