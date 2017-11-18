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
func getAllProcessingCompanyReceivedIds(stub  shim.ChaincodeStubInterface, option string) pb.Response {
	fmt.Println("getAllProcessingCompanyReceivedIds:Looking for All Abattoir Received");

	//get the AllAbattoirReceived index
	allBAsBytes, err := stub.GetState("allProcessingCompanyReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllProcessingCompanyReceivedIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing Company Received Ids")
	}

	var allIds AllProcessingCompanyReceivedIds
	var allDetails AllProcessingCompanyReceivedDetails

	for i := range res.ProcessingCompanyReceiptNumbers{

		sbAsBytes, err := stub.GetState(res.ProcessingCompanyReceiptNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Processing Company Receipt Number ")
		}
		var sb ProcessingCompanyReceived
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.ProcessingCompanyReceiptNumbers = append(allIds.ProcessingCompanyReceiptNumbers,sb.ProcessingCompanyReceiptNumber);	
		} else if option == "DETAILS" {
			allDetails.ProcessingCompanyReceived = append(allDetails.ProcessingCompanyReceived,sb);	
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
// Get All Processing Company Transactions
// ============================================================================================================================
func getAllProcessingCompanyTransactions(stub  shim.ChaincodeStubInterface, option string) pb.Response {
	fmt.Println("getAllProcessingCompanyTransactions: Looking for All Processing Company Transactions");

	//get the All processing company batch codes index
	allBAsBytes, err := stub.GetState("allProcessingCompanyBatchCodes")
	if err != nil {
		return shim.Error("Failed to get all Processing company Batch Codes")
	}

	var res AllProcessingCompanyBatchCodes
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing company Batch Codes records")
	}
	
	var allIds AllProcessingCompanyBatchCodes
	var allDetails AllProcessingCompanyTransactionDetails
	for i := range res.ProcessorBatchCodes{

		sbAsBytes, err := stub.GetState(res.ProcessorBatchCodes[i])
		if err != nil {
			return shim.Error("Failed to get processing company batch code record.")
		}
		var sb ProcessingCompanyTransaction
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.ProcessorBatchCodes = append(allIds.ProcessorBatchCodes,sb.ProcessorBatchCode);	
		} else if option == "DETAILS" {
			allDetails.ProcessingCompanyTransaction = append(allDetails.ProcessingCompanyTransaction,sb);	
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
// Get All Processing Company Dispatch
// ============================================================================================================================
func getAllProcessingCompanyDispatch(stub  shim.ChaincodeStubInterface, option string) pb.Response {
	fmt.Println("getAllProcessingCompanyDispatch: Looking for All Processing Company Dispatch records");

	//get the All processing company batch codes index
	allBAsBytes, err := stub.GetState("allProcessingCompanyDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Processing company dispatch consignment numbers")
	}

	var res AllProcessingCompanyDispatchIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing company dispatch records")
	}
	
	var allIds AllProcessingCompanyDispatchIds
	var allDetails AllProcessingCompanyDispatchDetails
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get processing company batch code record.")
		}
		var sb ProcessingCompanyDispatch
		json.Unmarshal(sbAsBytes, &sb)

		if option == "IDS" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers,sb.ConsignmentNumber);	
		} else if option == "DETAILS" {
			allDetails.ProcessingCompanyDispatch = append(allDetails.ProcessingCompanyDispatch,sb);	
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