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

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

type ProcessingCompanyReceived struct {
	ProcessingCompanyReceiptNumber		string	`json:"processingCompanyReceiptNumber"`
	ProcessingCompanyId					string	`json:"processingCompanyId"`
	PurchaseOrderNumber					string	`json:"purchaseOrderNumber"`	
	ConsignmentNumber					string	`json:"consignmentNumber"`	
	TransportConsitionSatisfied			string	`json:"transportConsitionSatisfied"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	UseByDate							string	`json:"useByDate"`
	ReceivedDate						string	`json:"receivedDate"`	
	TransitTime							string	`json:"transitTime"`
	Storage								string	`json:"storage"`
	AcceptanceCheckList					[]AcceptanceCriteria	`json:"acceptanceCheckList"`
}

type AcceptanceCriteria struct {
	Id						string	`json:"id"`	
	RuleCondition			string	`json:"ruleCondition"`
	ConditionSatisfied		string	`json:"conditionSatisfied"`
}



type ProcessingCompanyTransaction struct {
	ProcessorBatchCode					string	`json:"processorBatchCode"`	
	ProcessingCompanyId					string	`json:"processingCompanyId"`
	ProcessingCompanyReceiptNumber		string	`json:"processingCompanyReceiptNumber"`
	ProductCode							string	`json:"productCode"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	UseByDate							string	`json:"useByDate"`
	QualityControlDocument				string	`json:"qualityControlDocument"`	
	Storage								string	`json:"storage"`
	ProcessingAction					string	`json:"processingAction"`
}
// ProcessingAction - (W - St - P - QC - F)


type ProcessingCompanyDispatch struct {
	ConsignmentNumber				string	`json:"consignmentNumber"`
	ProcessorBatchCode				string	`json:"processorBatchCode"`
	ProcessingCompanyId				string	`json:"processingCompanyId"`
	IkeaPurchaseOrderNumber			string	`json:"ikeaPurchaseOrderNumber"`	
	GUIDNumber						string	`json:"guidNumber"`
	MaterialName					string	`json:"materialName"`
	MaterialGrade					string	`json:"materialGrade"`
	TemperatureStorageMin			string	`json:"temperatureStorageMin"`
	TemperatureStorageMax			string	`json:"temperatureStorageMax"`
	PackagingDate					string	`json:"packagingDate"`
	UseByDate						string	`json:"useByDate"`
	Quantity						string	`json:"quantity"`	
	QuantityUnit					string	`json:"quantityUnit"`
	QualityControlDocument			string	`json:"qualityControlDocument"`	
	Storage							string	`json:"storage"`	
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

type AllProcessingCompanyReceivedIds struct{
	ProcessingCompanyReceiptNumbers []string `json:"processingCompanyReceiptNumbers"`
}

type AllProcessingCompanyReceivedDetails struct{
	ProcessingCompanyReceived []ProcessingCompanyReceived `json:"processingCompanyReceived"`
}

type AllProcessingCompanyBatchCodes struct{
	ProcessorBatchCodes []string `json:"processorBatchCodes"`
}

type AllProcessingCompanyTransactionDetails struct{
	ProcessingCompanyTransaction []ProcessingCompanyTransaction `json:"processingCompanyTransaction"`
}

type AllProcessingCompanyDispatchIds struct{
	ConsignmentNumbers []string `json:"consignmentNumbers"`
}

type AllProcessingCompanyDispatchDetails struct{
	ProcessingCompanyDispatch []ProcessingCompanyDispatch `json:"processingCompanyDispatch"`
}

type AllLogisticTransactions struct{
	LogisticTransactionList []LogisticTransaction `json:"LogisticTransactionList"`
}

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
	
	var allProcessingCompanyReceivedIds AllProcessingCompanyReceivedIds
	jsonAsBytesProcessingCompanyReceiptNumbers, _ := json.Marshal(allProcessingCompanyReceivedIds)
	err = stub.PutState("allProcessingCompanyReceivedIds", jsonAsBytesProcessingCompanyReceiptNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}

	var allProcessingCompanyBatchCodes AllProcessingCompanyBatchCodes
	jsonAsBytesProcessingCompanyBatchCodes, _ := json.Marshal(allProcessingCompanyBatchCodes)
	err = stub.PutState("allProcessingCompanyBatchCodes", jsonAsBytesProcessingCompanyBatchCodes)
	if err != nil {		
		return shim.Error(err.Error())
	}
	
	
	var allProcessingCompanyDispatchIds AllProcessingCompanyDispatchIds
	jsonAsBytesAllProcessingCompanyDispatchIds, _ := json.Marshal(allProcessingCompanyDispatchIds)
	err = stub.PutState("allProcessingCompanyDispatchIds", jsonAsBytesAllProcessingCompanyDispatchIds)
	if err != nil {		
		return shim.Error(err.Error())
	}
	
	var allLogisticTransactions AllLogisticTransactions
	jsonAsBytesAllLogisticTransactions, _ := json.Marshal(allLogisticTransactions)
	err = stub.PutState("allLogisticTransactions", jsonAsBytesAllLogisticTransactions)
	if err != nil {		
		return shim.Error(err.Error())
	}

	fmt.Println(" - ready for action")                        
	return shim.Success(nil)
}


// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()	
	fmt.Println("starting invoke, for - " + function)

	// Handle different functions
	if function == "init" {                    //initialize the chaincode state, used as reset
		return t.Init(stub)
	} else if function == "getAllProcessingCompanyReceivedIds" {
		return getAllProcessingCompanyReceivedIds(stub, args[0])	
	} else if function == "saveProcessingCompanyReceived" {
		return saveProcessingCompanyReceived(stub, args)
	} else if function == "getAllProcessingCompanyTransactions" {
		return getAllProcessingCompanyTransactions(stub, args[0])
	} else if function == "saveProcessingCompanyTransaction" {
		return saveProcessingCompanyTransaction(stub, args)
	} else if function == "getAllProcessingCompanyDispatch" {
		return getAllProcessingCompanyDispatch(stub, args[0])
	} else if function == "saveAllProcessingCompanyDispatch" {
		return saveAllProcessingCompanyDispatch(stub, args)
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