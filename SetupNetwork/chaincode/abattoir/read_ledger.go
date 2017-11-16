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

// ============================================================================================================================
// Read - read a generic variable from ledger
//
// Shows Off GetState() - reading a key/value from the ledger
//
// Inputs - Array of strings
//  0
//  key
//  "abc"
// 
// Returns - string
// ============================================================================================================================
func read(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, jsonResp string
	var err error
	fmt.Println("starting read")

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting key of the var to query")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0]
	valAsbytes, err := stub.GetState(key)           //get the var from ledger
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	fmt.Println("- end read")
	return shim.Success(valAsbytes)                  //send it onward
}

// ============================================================================================================================
// Get Part Details
// ============================================================================================================================
func getPart(stub shim.ChaincodeStubInterface, partId string) pb.Response {
	fmt.Println("Start find Part")
	fmt.Println("Looking for Part #" + partId);

	//get the part index
	bAsBytes, err := stub.GetState(partId)
	if err != nil {
		return shim.Error("Failed to get Part #" + partId)
	}
	return shim.Success(bAsBytes)
}
		
// ============================================================================================================================
// Get All Parts
// ============================================================================================================================
func getAllParts(stub  shim.ChaincodeStubInterface, user string) pb.Response {
	fmt.Println("getAllParts:Looking for All Parts");

	//get the AllParts index
	allBAsBytes, err := stub.GetState("allParts")
	if err != nil {
		return shim.Error("Failed to get all Parts")
	}

	var res AllParts
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Parts")
	}

	var rab AllParts

	for i := range res.Parts{

		sbAsBytes, err := stub.GetState(res.Parts[i])
		if err != nil {
			return shim.Error("Failed to get Part")
		}
		var sb Part
		json.Unmarshal(sbAsBytes, &sb)

		// currently we show all parts to the users
		rab.Parts = append(rab.Parts,sb.PartId);
	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
}


// ============================================================================================================================
// Get All Abattoir Received
// ============================================================================================================================
func getAllAbattoirReceived(stub  shim.ChaincodeStubInterface, option string) pb.Response {
	fmt.Println("getAllAbattoirReceived:Looking for All Abattoir Received");

	//get the AllAbattoirReceived index
	allBAsBytes, err := stub.GetState("allAbattoirReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllAbattoirReceivedIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Abattoir Received")
	}

	var allIds AllAbattoirReceivedIds
	var allDetails AllAbattoirReceivedDetails
	for i := range res.PurchaseOrderReferenceNumbers{

		sbAsBytes, err := stub.GetState(res.PurchaseOrderReferenceNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Abattoir Received Id ")
		}
		var sb AbattoirMaterialReceived
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.PurchaseOrderReferenceNumbers = append(allIds.PurchaseOrderReferenceNumbers,sb.PurchaseOrderReferenceNumber);	
		} else if option == "DETAILS" {
			allDetails.AbattoirMaterialReceived = append(allDetails.AbattoirMaterialReceived,sb);	
		}		
	}
	
	if option == "IDS" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if option == "DETAILS" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Abattoir Dispatch
// ============================================================================================================================
func getAllAbattoirDispatch(stub  shim.ChaincodeStubInterface, option string) pb.Response {
	fmt.Println("getAllAbattoirDispatch:Looking for All Abattoir Dispatch");

	//get the AllAbattoirReceived index
	allBAsBytes, err := stub.GetState("allAbattoirDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir dispatch")
	}

	var res AllAbattoirDispatchIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Abattoir Dispatch records")
	}
	
	var allIds AllAbattoirDispatchIds
	var allDetails AllAbattoirDispatchDetails
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Abattoir Dispatch record.")
		}
		var sb AbattoirDispatch
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers,sb.ConsignmentNumber);	
		} else if option == "DETAILS" {
			allDetails.AbattoirMaterialDispatch = append(allDetails.AbattoirMaterialDispatch,sb);	
		}			
	}

	if option == "IDS" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if option == "DETAILS" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}


// ============================================================================================================================
// Get All Logistic Transactions
// ============================================================================================================================
func getAllLogisticTransactions(stub  shim.ChaincodeStubInterface, user string) pb.Response {
	fmt.Println("getAllLogisticTransactions: Looking for All Logistic Transactions");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allLogisticTransactions")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllLogisticTransactions
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Logistic Transactions records")
	}

	var rab AllLogisticTransactions

	for i := range res.LogisticTransactionList{

		sbAsBytes, err := stub.GetState(res.LogisticTransactionList[i].ConsignmentNumber)
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		var sb LogisticTransaction
		json.Unmarshal(sbAsBytes, &sb)

		// append all transactions to list
		rab.LogisticTransactionList = append(rab.LogisticTransactionList,sb);
	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
}

// ============================================================================================================================
// Get All Parts
// ============================================================================================================================
func getAllPartDetails(stub  shim.ChaincodeStubInterface, filter string, filterValue string) pb.Response {
	fmt.Println("getAllParts:Looking for All Parts");

	//get the AllParts index
	allBAsBytes, err := stub.GetState("allParts")
	if err != nil {
		return shim.Error("Failed to get all Parts")
	}

	var res AllParts
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Parts")
	}

	var rab AllPartDetails

	for i := range res.Parts{

		sbAsBytes, err := stub.GetState(res.Parts[i])
		if err != nil {
			return shim.Error("Failed to get Part")
		}
		var sb Part
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(filter) == "all"{
			rab.Parts = append(rab.Parts,sb);
		} else if strings.ToLower(filter) == "partid" {
			if strings.ToLower(sb.PartId) == strings.ToLower(filterValue) {
				rab.Parts = append(rab.Parts,sb);
			}
		} else if strings.ToLower(filter) == "batchcode" {
			if strings.ToLower(sb.BatchCode) == strings.ToLower(filterValue) {
				rab.Parts = append(rab.Parts,sb);
			}
		} else if strings.ToLower(filter) == "partcode" {
			if strings.ToLower(sb.PartCode) == strings.ToLower(filterValue) {
				rab.Parts = append(rab.Parts,sb);
			}
		} else if strings.ToLower(filter) == "parttype" {
			if strings.ToLower(sb.PartType) == strings.ToLower(filterValue) {
				rab.Parts = append(rab.Parts,sb);
			}
		} else if strings.ToLower(filter) == "vin" {
			if strings.ToLower(filterValue) == "all" {
				for j := range sb.Transactions{
					if sb.Transactions[j].Vin != "" && len(sb.Transactions[j].Vin) > 1 {
						rab.Parts = append(rab.Parts,sb);
					}
				}
			} else if filterValue != ""{
				for j := range sb.Transactions{
					if strings.ToLower(sb.Transactions[j].Vin) == strings.ToLower(filterValue) {
						rab.Parts = append(rab.Parts,sb);
					}
				}
			}
		}
	}

	rabAsBytes, _ := json.Marshal(rab)

	return shim.Success(rabAsBytes)
}
