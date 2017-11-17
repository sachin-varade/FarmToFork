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

// ============================================================================================================================
// Get All Abattoir Received
// ============================================================================================================================
func getAllAbattoirReceived(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
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
func getAllAbattoirDispatch(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
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
	
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Abattoir Dispatch record.")
		}
		var sb AbattoirDispatch
		json.Unmarshal(sbAsBytes, &sb)
		allDetails.AbattoirMaterialDispatch = append(allDetails.AbattoirMaterialDispatch,sb);	
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
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

		if strings.ToLower(option) == "ids" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers,sb.ConsignmentNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.AbattoirMaterialDispatch = append(allDetails.AbattoirMaterialDispatch,sb);	
		}}

	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	return shim.Success(nil)
}


// ============================================================================================================================
// Get All Logistic Transactions
// ============================================================================================================================
func getAllLogisticTransactions(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllLogisticTransactions: Looking for All Logistic Transactions");

	//get the LogisticTransactions index
	allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllLogisticTransactionIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Logistic Transactions records")
	}
	
	var allIds AllLogisticTransactionIds
	var allDetails AllLogisticTransactionDetails
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		var sb LogisticTransaction
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers, sb.ConsignmentNumber);	
		} else if option == "DETAILS" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
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