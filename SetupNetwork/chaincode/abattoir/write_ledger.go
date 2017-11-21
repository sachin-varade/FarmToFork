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

//Create AbattoirInward block
func saveAbattoirReceived(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveAbattoirReceived..")

	if len(args) != 13 {
		fmt.Println("Incorrect number of arguments. Expecting 9 - AbattoirId..")
		return shim.Error("Incorrect number of arguments. Expecting 9")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]);

	var bt AbattoirMaterialReceived
	bt.AbattoirId				= args[0]
	bt.PurchaseOrderReferenceNumber			= args[1]
	bt.RawMaterialBatchNumber			= args[2]	
	bt.FarmerId					= args[3]
	bt.GUIDNumber					= args[4]
	bt.MaterialName				= args[5]
	bt.MaterialGrade			= args[6]
	bt.UsedByDate				= args[7]
	bt.Quantity					= args[8]
	bt.QuantityUnit					= args[9]	
	bt.UpdatedBy					= args[11]	
	bt.UpdatedOn					= args[12]	

	var cert FarmersCertificate
	
	if args[10] != "" {
		p := strings.Split(args[10], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			cert.Id = c[0]
			cert.Name = c[1]
			bt.Certificates = append(bt.Certificates, cert)
		}
	}

	//Commit Inward entry to ledger
	fmt.Println("saveAbattoirReceived - Commit AbattoirInward To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.PurchaseOrderReferenceNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Abattoirs Array
	allBAsBytes, err := stub.GetState("allAbattoirReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Inward Ids")
	}
	var allb AllAbattoirReceivedIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Received")
	}
	allb.PurchaseOrderReferenceNumbers = append(allb.PurchaseOrderReferenceNumbers, bt.PurchaseOrderReferenceNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allAbattoirReceivedIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create AbattoirDispatch block
func saveAbattoirDispatch(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveAbattoirDispatch..")

	if len(args) != 15 {
		fmt.Println("Incorrect number of arguments. Expecting 12 - AbattoirId..")
		return shim.Error("Incorrect number of arguments. Expecting 12")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]+","+args[13]+","+args[14]);

	var bt AbattoirDispatch	
	bt.AbattoirId				= args[0]
	bt.ConsignmentNumber		= args[1]
	bt.PurchaseOrderReferenceNumber			= args[2]
	bt.RawMaterialBatchNumber			= args[3]
	bt.GUIDNumber				= args[4]
	bt.MaterialName				= args[5]
	bt.MaterialGrade			= args[6]
	bt.TemperatureStorageMin	= args[7]
	bt.TemperatureStorageMax	= args[8]
	bt.ProductionDate			= args[9]
	bt.UsedByDate				= args[10]	
	bt.Quantity					= args[11]
	bt.QuantityUnit				= args[12]
	bt.UpdatedBy					= args[13]	
	bt.UpdatedOn					= args[14]	
	//Commit Inward entry to ledger
	fmt.Println("saveAbattoirDispatch - Commit AbattoirDispatch To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array
	allBAsBytes, err := stub.GetState("allAbattoirDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Dispatch")
	}
	var allb AllAbattoirDispatchIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all dispatch")
	}
	allb.ConsignmentNumbers = append(allb.ConsignmentNumbers,bt.ConsignmentNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allAbattoirDispatchIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

//Create LogisticTransaction block
func saveLogisticTransaction(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveLogisticTransaction..")

	if len(args) != 17 {
		fmt.Println("Incorrect number of arguments. Expecting 17")
		return shim.Error("Incorrect number of arguments. Expecting 17")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]+","+args[11]+","+args[12]+","+args[13]+","+args[14]);

	var bt LogisticTransaction
	bt.LogisticId				= args[0]
	bt.LogisticType				= args[1]
	bt.ConsignmentNumber				= args[2]
	bt.RouteId							= args[3]
	bt.AbattoirConsignmentNumber			= args[4]
	bt.VehicleId						= args[5]
	bt.VehicleTypeId						= args[6]
	bt.DispatchDateTime					= args[7]
	bt.ExpectedDeliveryDateTime			= args[8]	
	bt.TemperatureStorageMin			= args[9]
	bt.TemperatureStorageMax			= args[10]
	bt.Quantity							= args[11]
	bt.QuantityUnit							= args[12]
	bt.HandlingInstruction				= args[13]	
	bt.UpdatedOn				= args[14]	
	bt.UpdatedBy				= args[15]	
	bt.CurrentStatus				= args[16]	
	
	var st ShipmentStatusTransaction
	st.ShipmentStatus		= args[16]		// Default shipment status should be PickedUp
	st.ShipmentDate 		= args[14]	
	bt.ShipmentStatus = append(bt.ShipmentStatus, st)

	//Commit Inward entry to ledger
	fmt.Println("saveLogisticTransaction - Commit LogisticTransaction To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.ConsignmentNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All AbattoirDispatch Array
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Dispatch")
	}
	var allb AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all dispatch")
	}
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
	if strings.ToLower(bch.CurrentStatus) == "delivered" {
		bch.ExpectedDeliveryDateTime			= args[4]	
	}
	var tx ShipmentStatusTransaction
	tx.ShipmentStatus 	= args[2];
	tx.ShipmentDate		= args[3];

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

