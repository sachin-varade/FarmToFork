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
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

//Create ProcessorReceived block
func saveProcessorReceived(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveProcessorReceived..")

	if len(args) != 16 {
		fmt.Println("Incorrect number of arguments. Expecting 16")
		return shim.Error("Incorrect number of arguments. Expecting 16")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]);
	allBAsBytes, err := stub.GetState("allProcessorReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Processing Company Received Ids")
	}
	var allb AllProcessorReceivedIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Received")
	}
	if checkDuplicateId(allb.ProcessorReceiptNumbers, args[0]) == 0{
		return shim.Error("Duplicate ProcessorReceiptNumber - "+ args[0])
	}

	var bt ProcessorReceived
	bt.ProcessorReceiptNumber	= args[0]
	bt.ProcessorId				= args[1]
	bt.PurchaseOrderNumber				= args[2]
	bt.ConsignmentNumber				= args[3]	
	bt.TransportConsitionSatisfied		= args[4]
	bt.GUIDNumber						= args[5]
	bt.MaterialName						= args[6]
	bt.MaterialGrade					= args[7]	
	bt.Quantity							= args[8]
	bt.QuantityUnit						= args[9]	
	bt.UsedByDate						= args[10]
	bt.ReceivedDate						= args[11]
	bt.TransitTime						= args[12]
	bt.UpdatedBy						= args[14]
	bt.UpdatedOn						= args[15]

	var acceptanceCriteria AcceptanceCriteria
	
	if args[13] != "" {
		p := strings.Split(args[13], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			acceptanceCriteria.Id 					= c[0]
			acceptanceCriteria.RuleCondition 		= c[1]
			acceptanceCriteria.ConditionSatisfied 	= c[2]
			bt.AcceptanceCheckList	= append(bt.AcceptanceCheckList, acceptanceCriteria)
		}
	}

	//Commit Inward entry to ledger
	fmt.Println("saveProcessorReceived - Commit ProcessorReceived To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ProcessorReceiptNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Processing Company ReceivedIds Array	
	allb.ProcessorReceiptNumbers = append(allb.ProcessorReceiptNumbers, bt.ProcessorReceiptNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allProcessorReceivedIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create Processing Company Transaction block
func saveProcessingTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveProcessingTransaction..")

	if len(args) != 16 {
		fmt.Println("Incorrect number of arguments. Expecting 16..")
		return shim.Error("Incorrect number of arguments. Expecting 16")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);
	allBAsBytes, err := stub.GetState("allProcessingTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all Processing Company BatchCodes")
	}
	var allb AllProcessingTransactionIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Processing Batch Codes")
	}
	if checkDuplicateId(allb.ProcessorBatchCodes, args[0]) == 0{
		return shim.Error("Duplicate ProcessorBatchCode - "+ args[0])
	}

	var bt ProcessingTransaction	
	bt.ProcessorBatchCode				= args[0]
	bt.ProcessorId				= args[1]
	bt.ProcessorReceiptNumber	= args[2]
	bt.ProductCode						= args[3]
	bt.GUIDNumber						= args[4]
	bt.MaterialName						= args[5]
	bt.MaterialGrade					= args[6]
	bt.Quantity							= args[7]
	bt.QuantityUnit						= args[8]
	bt.UsedByDate						= args[9]
	bt.PackagingDate					= args[10]
	bt.Storage							= args[12]
	bt.UpdatedBy						= args[14]
	bt.UpdatedOn						= args[15]
	var pa ProcessingAction
	pa.Action = args[13]
	pa.DoneWhen = args[15]
	bt.ProcessingAction					= append(bt.ProcessingAction, pa)	

	var cert QualityControlDocument
	
	if args[11] != "" {
		p := strings.Split(args[11], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			cert.Id = c[0]
			cert.Name = c[1]
			cert.FileName = c[2]
			cert.Hash = c[3]
			bt.QualityControlDocument = append(bt.QualityControlDocument, cert)
		}
	}

	//Commit Inward entry to ledger
	fmt.Println("saveProcessingTransaction - Commit ProcessingTransaction To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ProcessorBatchCode, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Processing Company Transaction Array	
	allb.ProcessorBatchCodes = append(allb.ProcessorBatchCodes,bt.ProcessorBatchCode)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allProcessingTransactionIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


//Create Processing Company Dispatch block
func saveProcessorDispatch(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveProcessorDispatch..")

	if len(args) != 18 {
		fmt.Println("Incorrect number of arguments. Expecting 18..")
		return shim.Error("Incorrect number of arguments. Expecting 18")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);
	allBAsBytes, err := stub.GetState("allProcessorDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Processing Company Dispatch Consignment Numbers")
	}
	var allb AllProcessorDispatchIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Processing dispatch consignment numbers")
	}
	if checkDuplicateId(allb.ConsignmentNumbers, args[0]) == 0{
		return shim.Error("Duplicate ConsignmentNumber - "+ args[0])
	}

	var bt ProcessorDispatch	
	bt.ConsignmentNumber				= args[0]
	bt.ProcessorBatchCode				= args[1]
	bt.ProcessorId				= args[2]
	bt.IkeaPurchaseOrderNumber			= args[3]
	bt.GUIDNumber						= args[4]
	bt.MaterialName						= args[5]
	bt.MaterialGrade					= args[6]
	bt.TemperatureStorageMin			= args[7]
	bt.TemperatureStorageMax			= args[8]
	bt.PackagingDate					= args[9]
	bt.UsedByDate						= args[10]	
	bt.DispatchDate						= args[11]

	bt.Quantity							= args[12]
	bt.QuantityUnit						= args[13]
	
	bt.Storage							= args[15]
	bt.UpdatedBy						= args[16]
	bt.UpdatedOn						= args[17]

	var cert QualityControlDocument
	
	if args[14] != "" {
		p := strings.Split(args[14], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			cert.Id = c[0]
			cert.Name = c[1]
			cert.FileName = c[2]
			cert.Hash = c[3]
			bt.QualityControlDocument = append(bt.QualityControlDocument, cert)
		}
	}
	//Commit Inward entry to ledger
	fmt.Println("saveProcessorDispatch - Commit ProcessorDispatch To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	//Update All Processing Company Dispatch Array	
	allb.ConsignmentNumbers = append(allb.ConsignmentNumbers,bt.ConsignmentNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allProcessorDispatchIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create LogisticTransaction block
func saveLogisticTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveLogisticTransaction..")

	if len(args) != 19 {
		fmt.Println("Incorrect number of arguments. Expecting 19")
		return shim.Error("Incorrect number of arguments. Expecting 19")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]+","+args[13]+","+args[14]);
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Dispatch")
	}
	var allb AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all dispatch")
	}
	if checkDuplicateId(allb.ConsignmentNumbers, args[2]) == 0{
		return shim.Error("Duplicate ConsignmentNumber - "+ args[2])
	}

	var bt LogisticTransaction
	bt.LogisticId				= args[0]
	bt.LogisticType				= args[1]
	bt.ConsignmentNumber				= args[2]
	bt.RouteId							= args[3]
	bt.ProcessorConsignmentNumber			= args[4]
	bt.VehicleId						= args[5]
	bt.VehicleTypeId						= args[6]
	bt.DispatchDateTime					= args[7]
	bt.ExpectedDeliveryDateTime			= args[8]	
	bt.ActualDeliveryDateTime			= args[18]	
	bt.TemperatureStorageMin			= args[9]
	bt.TemperatureStorageMax			= args[10]
	bt.Quantity							= args[11]
	bt.QuantityUnit							= args[12]
	bt.HandlingInstruction				= args[13]	
	bt.UpdatedOn				= args[14]	
	bt.UpdatedBy				= args[15]	
	bt.CurrentStatus				= "Delivered" //args[16]	
	
	var st ShipmentStatusTransaction
	st.ShipmentStatus		= args[16]		// Default shipment status should be PickedUp
	st.ShipmentDate 		= args[7]
	bt.ShipmentStatus = append(bt.ShipmentStatus, st)

	st.ShipmentStatus		= "InTransit"
	st.ShipmentDate 		= args[17]
	bt.ShipmentStatus = append(bt.ShipmentStatus, st)

	st.ShipmentStatus		= "Delivered"
	st.ShipmentDate 		= args[18]
	bt.ShipmentStatus = append(bt.ShipmentStatus, st)

	//Commit Inward entry to ledger
	fmt.Println("saveLogisticTransaction - Commit LogisticTransaction To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array	
	allb.ConsignmentNumbers = append(allb.ConsignmentNumbers, bt.ConsignmentNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allLogisticTransactionIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// **********************************************************************
//		Updating Logistics transation status in blockchain
// **********************************************************************
func updateLogisticTransactionStatus(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running updateLogisticTransactionStatus..")

	if len(args) != 5 {
		fmt.Println("Incorrect number of arguments. Expecting 5 - ConsignmentNumber, LogisticId, ShipmentStatus, ShipmentDate.")
		return shim.Error("Incorrect number of arguments. Expecting 5")
	}
	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]);

	//Get and Update LogisticTransaction data
	bAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get LogisticTransaction # " + args[0])
	}
	var bch LogisticTransaction
	err = json.Unmarshal(bAsBytes, &bch)
	if err != nil {
		return shim.Error("Failed to Unmarshal LogisticTransaction # " + args[0])
	}	
	bch.CurrentStatus = args[2]
	if strings.ToLower(args[2]) == "delivered" {
		bch.ActualDeliveryDateTime			= args[4]	
	}
	var tx ShipmentStatusTransaction
	tx.ShipmentStatus 	= args[2];
	tx.ShipmentDate		= args[4];

	bch.ShipmentStatus = append(bch.ShipmentStatus, tx)

	//Commit updates LogisticTransaction status to ledger
	fmt.Println("updateLogisticTransactionStatus Commit Updates To Ledger");
	btAsBytes, _ := json.Marshal(bch)
	err = stub.PutState(bch.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// **********************************************************************
//		Updating Logistics transation status in blockchain
// **********************************************************************
func pushIotDetailsToLogisticTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running pushIotDetailsToLogisticTransaction..")

	if len(args) != 5 {
		fmt.Println("Incorrect number of arguments. Expecting 4 - ConsignmentNumber, LogisticId, ShipmentStatus, ShipmentDate.")
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}
	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]);

	//Get and Update LogisticTransaction data
	bAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get LogisticTransaction # " + args[0])
	}
	var bch LogisticTransaction
	err = json.Unmarshal(bAsBytes, &bch)
	if err != nil {
		return shim.Error("Failed to Unmarshal LogisticTransaction # " + args[0])
	}

	var tx IotHistory
	tx.Temperature 	= args[2];
	tx.Location		= args[3];
	tx.UpdatedOn		= args[4];

	bch.IotTemperatureHistory = append(bch.IotTemperatureHistory, tx)

	//Commit updates LogisticTransaction status to ledger
	fmt.Println("pushIotDetailsToLogisticTransaction Commit Updates To Ledger");
	btAsBytes, _ := json.Marshal(bch)
	err = stub.PutState(bch.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

