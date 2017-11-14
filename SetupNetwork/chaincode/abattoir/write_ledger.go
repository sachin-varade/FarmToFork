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

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// creating new part in blockchain
func createPart(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running createPart")

	if len(args) != 9 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - PartId, Part Code, Manufacture Date, User, Part Type, Part Name, Description, Batch Code, QR Code")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]);

	var bt Part
	bt.PartId 			= args[0]
	bt.PartCode			= args[1]
	bt.PartType			= args[4]
	bt.PartName			= args[5]
	bt.Description			= args[6]
	bt.BatchCode			= args[7]
	bt.QRCode			= args[8]
	var tx Transaction
	tx.DateOfManufacture		= args[2]
	tx.TType 			= "CREATE"
	tx.User 			= args[3]
	bt.Transactions = append(bt.Transactions, tx)

	//Commit part to ledger
	fmt.Println("createPart Commit Part To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PartId, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Parts Array
	allBAsBytes, err := stub.GetState("allParts")
	if err != nil {
		return shim.Error("Failed to get all Parts")
	}
	var allb AllParts
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Parts")
	}
	allb.Parts = append(allb.Parts,bt.PartId)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allParts", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

// Updating existing part in blockchain
func updatePart(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running updatePart")

	if len(args) != 9 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - PartId, Vehicle Id, Delivery Date, Installation Date, User, Warranty Start Date, Warranty End Date, Type, vin")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}
	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]);

	//Get and Update Part data
	bAsBytes, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error("Failed to get Part #" + args[0])
	}
	var bch Part
	err = json.Unmarshal(bAsBytes, &bch)
	if err != nil {
		return shim.Error("Failed to Unmarshal Part #" + args[0])
	}

	var tx Transaction
	tx.TType 	= args[7];

	tx.VehicleId		= args[1]
	tx.DateOfDelivery	= args[2]
	tx.DateOfInstallation	= args[3]
	tx.User  		= args[4]
	tx.WarrantyStartDate	= args[5]
	tx.WarrantyEndDate	= args[6]
	tx.Vin	= args[8]

	bch.Transactions = append(bch.Transactions, tx)

	//Commit updates part to ledger
	fmt.Println("updatePart Commit Updates To Ledger");
	btAsBytes, _ := json.Marshal(bch)
	err = stub.PutState(bch.PartId, btAsBytes)
	if err != nil {		
		fmt.Println("error");
		return shim.Error(err.Error())
	}
	fmt.Println("success");
	return shim.Success(nil)
}

//Create AbattoirInward block
func createAbattoirInward(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running createAbattoirInward..")

	if len(args) != 9 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - AbattoirId..")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]);

	var bt AbattoirMaterialInward
	bt.AbattoirId				= args[0]
	bt.AbattoirInwardId			= args[1]
	bt.FarmerId					= args[2]
	bt.MaterialName				= args[3]
	bt.MaterialGrade			= args[4]
	bt.UseByDate				= args[5]
	bt.Quantity					= args[6]
	bt.GUIDNumber				= args[7]

	// var tx Transaction
	// tx.DateOfManufacture		= args[2]
	// tx.TType 			= "CREATE"
	// tx.User 			= args[3]
	// bt.Transactions = append(bt.Transactions, tx)

	var certificate string
	certificate			= args[8]
	bt.Certificates = append(bt.Certificates, certificate)

	//Commit Inward entry to ledger
	fmt.Println("createAbattoirInward - Commit AbattoirInward To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.AbattoirInwardId, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Parts Array
	allBAsBytes, err := stub.GetState("allAbattoirInwardIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Inward Ids")
	}
	var allb AllAbattoirInwardIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Inwards")
	}
	allb.AbattoirInwardIds = append(allb.AbattoirInwardIds,bt.AbattoirInwardId)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allAbattoirInwardIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create AbattoirDispatch block
func createAbattoirDispatch(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running createAbattoirDispatch..")

	if len(args) != 12 {
		fmt.Println("Incorrect number of arguments. Expecting 12 - AbattoirId..")
		return shim.Error("Incorrect number of arguments. Expecting 12")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]);

	var bt AbattoirDispatch	
	bt.AbattoirId				= args[0]
	bt.ConsignmentNumber		= args[1]
	bt.AbattoirInwardId			= args[2]
	bt.GUIDNumber				= args[3]
	bt.MaterialName				= args[4]
	bt.MaterialGrade			= args[5]
	bt.TemperatureStorageMin	= args[6]
	bt.TemperatureStorageMax	= args[7]
	bt.ProductionDate			= args[8]
	bt.UseByDate				= args[9]
	bt.Quantity					= args[10]
	
	var certificate string
	certificate			= args[11]
	bt.Certificates = append(bt.Certificates, certificate)

	//Commit Inward entry to ledger
	fmt.Println("createAbattoirDispatch - Commit AbattoirDispatch To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array
	allBAsBytes, err := stub.GetState("allAbattoirDispatch")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Dispatch")
	}
	var allb AllAbattoirDispatch
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all dispatch")
	}
	allb.AbattoirDispatchList = append(allb.AbattoirDispatchList,bt)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allAbattoirDispatch", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create LogisticTransaction block
func createLogisticTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running createLogisticTransaction..")

	if len(args) != 14 {
		fmt.Println("Incorrect number of arguments. Expecting 14")
		return shim.Error("Incorrect number of arguments. Expecting 14")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]+","+args[13]);

	var bt LogisticTransaction
	bt.LogisticProviderId				= args[0]
	bt.ConsignmentNumber				= args[1]
	bt.RouteId							= args[2]
	bt.AbattoirConsignmentId			= args[3]
	bt.VehicleId						= args[4]
	bt.VehicleType						= args[5]
	bt.PickupDateTime					= args[6]
	bt.ExpectedDeliveryDateTime			= args[7]
	bt.ActualDeliveryDateTime			= args[8]
	bt.TemperatureStorageMin			= args[9]
	bt.TemperatureStorageMax			= args[10]
	bt.Quantity							= args[11]
	bt.HandlingInstruction				= args[12]
	bt.ShipmentStatus					= args[13]
	
	
	//Commit Inward entry to ledger
	fmt.Println("createLogisticTransaction - Commit LogisticTransaction To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array
	allBAsBytes, err := stub.GetState("allLogisticTransactions")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Dispatch")
	}
	var allb AllLogisticTransactions
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all dispatch")
	}
	allb.LogisticTransactionList = append(allb.LogisticTransactionList,bt)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allLogisticTransactions", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

