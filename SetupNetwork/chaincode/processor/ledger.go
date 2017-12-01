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

type ProcessorReceived struct {
	ProcessorReceiptNumber		string	`json:"processorReceiptNumber"`
	ProcessorId					string	`json:"processorId"`
	PurchaseOrderNumber					string	`json:"purchaseOrderNumber"`	
	ConsignmentNumber					string	`json:"consignmentNumber"`	
	TransportConsitionSatisfied			string	`json:"transportConsitionSatisfied"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	UsedByDate							string	`json:"usedByDate"`
	ReceivedDate						string	`json:"receivedDate"`	
	TransitTime							string	`json:"transitTime"`
	Storage								string	`json:"storage"`
	AcceptanceCheckList					[]AcceptanceCriteria	`json:"acceptanceCheckList"`
	UpdatedOn			string	`json:"updatedOn"`
	UpdatedBy			string	`json:"updatedBy"`
}

type AcceptanceCriteria struct {
	Id						string	`json:"id"`	
	RuleCondition			string	`json:"ruleCondition"`
	ConditionSatisfied		string	`json:"conditionSatisfied"`
}

type ProcessingTransaction struct {
	ProcessorBatchCode					string	`json:"processorBatchCode"`	
	ProcessorId					string	`json:"processorId"`
	ProcessorReceiptNumber		string	`json:"processorReceiptNumber"`
	ProductCode							string	`json:"productCode"`
	GUIDNumber							string	`json:"guidNumber"`
	MaterialName						string	`json:"materialName"`
	MaterialGrade						string	`json:"materialGrade"`	
	Quantity							string	`json:"quantity"`
	QuantityUnit						string	`json:"quantityUnit"`	
	UsedByDate							string	`json:"usedByDate"`
	QualityControlDocument				string	`json:"qualityControlDocument"`	
	Storage								string	`json:"storage"`
	ProcessingAction					[]ProcessingAction	`json:"processingAction"`
	UpdatedOn			string	`json:"updatedOn"`
	UpdatedBy			string	`json:"updatedBy"`
}

// ProcessingAction - (W - St - P - QC - F)
type ProcessingAction struct {
	Action								string	`json:"action"`
	DoneWhen							string	`json:"doneWhen"`
}

type ProcessorDispatch struct {
	ConsignmentNumber				string	`json:"consignmentNumber"`
	ProcessorBatchCode				string	`json:"processorBatchCode"`
	ProcessorId				string	`json:"processorId"`
	IkeaPurchaseOrderNumber			string	`json:"ikeaPurchaseOrderNumber"`	
	GUIDNumber						string	`json:"guidNumber"`
	MaterialName					string	`json:"materialName"`
	MaterialGrade					string	`json:"materialGrade"`
	TemperatureStorageMin			string	`json:"temperatureStorageMin"`
	TemperatureStorageMax			string	`json:"temperatureStorageMax"`
	PackagingDate					string	`json:"packagingDate"`
	UsedByDate						string	`json:"usedByDate"`
	Quantity						string	`json:"quantity"`	
	QuantityUnit					string	`json:"quantityUnit"`
	QualityControlDocument			string	`json:"qualityControlDocument"`	
	Storage							string	`json:"storage"`	
	UpdatedOn			string	`json:"updatedOn"`
	UpdatedBy			string	`json:"updatedBy"`
}


type LogisticTransaction struct {	
	LogisticId				string	`json:"logisticId"`
	LogisticType					string	`json:"logisticType"`
	ConsignmentNumber				string	`json:"consignmentNumber"`		
	RouteId							string	`json:"routeId"`
	AbattoirConsignmentNumber			string	`json:"abattoirConsignmentNumber"`	
	ProcessorConsignmentNumber			string	`json:"processorConsignmentNumber"`	
	VehicleId						string	`json:"vehicleId"`
	VehicleTypeId						string	`json:"vehicleTypeId"`
	DispatchDateTime					string	`json:"dispatchDateTime"`
	ExpectedDeliveryDateTime		string	`json:"expectedDeliveryDateTime"`
	ActualDeliveryDateTime			string	`json:"actualDeliveryDateTime"`
	TemperatureStorageMin			string	`json:"temperatureStorageMin"`
	TemperatureStorageMax			string	`json:"temperatureStorageMax"`
	Quantity						string	`json:"quantity"`	
	QuantityUnit						string	`json:"quantityUnit"`	
	CurrentStatus						string	`json:"currentStatus"`	
	HandlingInstruction				string	`json:"handlingInstruction"`
	ShipmentStatus					[]ShipmentStatusTransaction	`json:"shipmentStatus"`
	IotTemperatureHistory			[]IotHistory `json:"iotTemperatureHistory"`
	UpdatedOn			string	`json:"updatedOn"`
	UpdatedBy			string	`json:"updatedBy"`
}

type ShipmentStatusTransaction struct {
	ShipmentStatus 			string 	`json:"shipmentStatus"`
	ShipmentDate 			string  `json:"shipmentDate"`
}

type IotHistory struct {
	Temperature	string `json:"temperature"`
	Location	string `json:"location"`
	UpdatedOn			string	`json:"updatedOn"`
}

type AllProcessorReceivedIds struct{
	ProcessorReceiptNumbers []string `json:"processorReceiptNumbers"`
}

type AllProcessorReceivedDetails struct{
	ProcessorReceived []ProcessorReceived `json:"processorReceived"`
}

type AllProcessingTransactionIds struct{
	ProcessorBatchCodes []string `json:"processorBatchCodes"`
}

type AllProcessingTransactionDetails struct{
	ProcessingTransaction []ProcessingTransaction `json:"processingTransaction"`
}

type AllProcessorDispatchIds struct{
	ConsignmentNumbers []string `json:"consignmentNumbers"`
}

type AllProcessorDispatchDetails struct{
	ProcessorDispatch []ProcessorDispatch `json:"processorDispatch"`
}

type AllLogisticTransactionIds struct{
	ConsignmentNumbers []string `json:"ConsignmentNumbers"`
}

type AllLogisticTransactionDetails struct{
	LogisticTransactions []LogisticTransaction `json:"logisticTransactions"`
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
	
	var allProcessorReceivedIds AllProcessorReceivedIds
	jsonAsBytesProcessorReceiptNumbers, _ := json.Marshal(allProcessorReceivedIds)
	err = stub.PutState("allProcessorReceivedIds", jsonAsBytesProcessorReceiptNumbers)
	if err != nil {		
		return shim.Error(err.Error())
	}

	var allProcessingTransactionIds AllProcessingTransactionIds
	jsonAsBytesProcessingCompanyBatchCodes, _ := json.Marshal(allProcessingTransactionIds)
	err = stub.PutState("allProcessingTransactionIds", jsonAsBytesProcessingCompanyBatchCodes)
	if err != nil {		
		return shim.Error(err.Error())
	}
	
	var allProcessorDispatchIds AllProcessorDispatchIds
	jsonAsBytesAllProcessorDispatchIds, _ := json.Marshal(allProcessorDispatchIds)
	err = stub.PutState("allProcessorDispatchIds", jsonAsBytesAllProcessorDispatchIds)
	if err != nil {		
		return shim.Error(err.Error())
	}
	
	var allLogisticTransactionIds AllLogisticTransactionIds
	jsonAsBytesAllLogisticTransactionIds, _ := json.Marshal(allLogisticTransactionIds)
	err = stub.PutState("allLogisticTransactionIds", jsonAsBytesAllLogisticTransactionIds)
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
	} else if function == "getAllProcessorReceived" {
		return getAllProcessorReceived(stub, args[0], args[1])	
	} else if function == "saveProcessorReceived" {
		return saveProcessorReceived(stub, args)
	} else if function == "getAllProcessingTransactions" {
		return getAllProcessingTransactions(stub, args[0], args[1])
	} else if function == "saveProcessingTransaction" {
		return saveProcessingTransaction(stub, args)
	} else if function == "getAllProcessorDispatch" {
		return getAllProcessorDispatch(stub, args[0], args[1])
	} else if function == "saveProcessorDispatch" {
		return saveProcessorDispatch(stub, args)
	} else if function == "getAllLogisticTransactions" {
		return getAllLogisticTransactions(stub, args[0], args[1])
	} else if function == "saveLogisticTransaction" {
		return saveLogisticTransaction(stub, args)
	} else if function == "updateLogisticTransactionStatus" {
		return updateLogisticTransactionStatus(stub, args)
	} else if function == "pushIotDetailsToLogisticTransaction" {
		return pushIotDetailsToLogisticTransaction(stub, args)
	} else if function == "getUniqueId" {
		return getUniqueId(stub, args[0], args[1])
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