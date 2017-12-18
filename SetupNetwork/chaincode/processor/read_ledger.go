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
	"strconv"
	
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Get All Abattoir Received
// ============================================================================================================================
func getAllProcessorReceived(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllProcessorReceived:Looking for All Abattoir Received");

	//get the AllAbattoirReceived index
	allBAsBytes, err := stub.GetState("allProcessorReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllProcessorReceivedIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing Company Received Ids")
	}

	var allIds AllProcessorReceivedIds
	var allDetails AllProcessorReceivedDetails
	var sb ProcessorReceived
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Processing Company Receipt Number ")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ProcessorReceiptNumber != "" {
			allDetails.ProcessorReceived = append(allDetails.ProcessorReceived,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}

	for i := range res.ProcessorReceiptNumbers{
		sbAsBytes, err := stub.GetState(res.ProcessorReceiptNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Processing Company Receipt Number ")
		}		
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.ProcessorReceiptNumbers = append(allIds.ProcessorReceiptNumbers,sb.ProcessorReceiptNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.ProcessorReceived = append(allDetails.ProcessorReceived,sb);	
		}
	}
	
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
// Get All Processing Company Transactions
// ============================================================================================================================
func getAllProcessingTransactions(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllProcessingTransactions: Looking for All Processing Company Transactions");

	//get the All processing company batch codes index
	allBAsBytes, err := stub.GetState("allProcessingTransactionIds")
	if err != nil {
		return shim.Error("Failed to get all Processing company Batch Codes")
	}

	var res AllProcessingTransactionIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing company Batch Codes records")
	}
	var allIds AllProcessingTransactionIds
	var allDetails AllProcessingTransactionDetails
	var sb ProcessingTransaction
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get processing company batch code record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ProcessorBatchCode != "" {
			allDetails.ProcessingTransaction = append(allDetails.ProcessingTransaction,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	for i := range res.ProcessorBatchCodes{
		sbAsBytes, err := stub.GetState(res.ProcessorBatchCodes[i])
		if err != nil {
			return shim.Error("Failed to get processing company batch code record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if strings.ToLower(option) == "ids" {
			allIds.ProcessorBatchCodes = append(allIds.ProcessorBatchCodes,sb.ProcessorBatchCode);	
		} else if strings.ToLower(option) == "details" {
			allDetails.ProcessingTransaction = append(allDetails.ProcessingTransaction,sb);	
		}
	}

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
// Get All Processing Company Dispatch
// ============================================================================================================================
func getAllProcessorDispatch(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllProcessorDispatch: Looking for All Processing Company Dispatch records");

	//get the All processing company batch codes index
	allBAsBytes, err := stub.GetState("allProcessorDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Processing company dispatch consignment numbers")
	}

	var res AllProcessorDispatchIds
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all Processing company dispatch records")
	}
	var allIds AllProcessorDispatchIds
	var allDetails AllProcessorDispatchDetails
	var sb ProcessorDispatch
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get processing dispatch record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ConsignmentNumber != "" {
			allDetails.ProcessorDispatch = append(allDetails.ProcessorDispatch,sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get processing company batch code record.")
		}		
		json.Unmarshal(sbAsBytes, &sb)
		if strings.ToLower(option) == "ids" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers,sb.ConsignmentNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.ProcessorDispatch = append(allDetails.ProcessorDispatch,sb);	
		} else if strings.ToLower(option) == "po" {
			c := strings.Split(value, "^")
			fmt.Println("value is "+ c[0] +", should equal-"+ sb.IkeaPurchaseOrderNumber);
			fmt.Println("value is "+ c[1] +", should equal-"+ sb.IkeaId);
			if strings.ToLower(sb.IkeaPurchaseOrderNumber) == strings.ToLower(c[0]) && strings.ToLower(sb.IkeaId) == strings.ToLower(c[1]) {
				allDetails.ProcessorDispatch = append(allDetails.ProcessorDispatch,sb);		
			}
		}
	}

	if strings.ToLower(option) == "ids" {
		rabAsBytes, _ := json.Marshal(allIds)		
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" || strings.ToLower(option) == "po" {
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
	var sb LogisticTransaction
	var allIds AllLogisticTransactionIds
	var allDetails AllLogisticTransactionDetails
	if strings.ToLower(option) == "id" && value != "" {
		sbAsBytes, err := stub.GetState(value)
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		json.Unmarshal(sbAsBytes, &sb)
		if sb.ConsignmentNumber != "" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}
		rabAsBytes, _ := json.Marshal(allDetails)
		return shim.Success(rabAsBytes)	
	}
	
	for i := range res.ConsignmentNumbers{

		sbAsBytes, err := stub.GetState(res.ConsignmentNumbers[i])
		if err != nil {
			return shim.Error("Failed to get Logistic Transaction record.")
		}
		var sb LogisticTransaction
		json.Unmarshal(sbAsBytes, &sb)

		if strings.ToLower(option) == "ids" {
			allIds.ConsignmentNumbers = append(allIds.ConsignmentNumbers, sb.ConsignmentNumber);	
		} else if strings.ToLower(option) == "details" {
			allDetails.LogisticTransactions = append(allDetails.LogisticTransactions, sb);	
		}	
	}

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
// Get unique number
// ============================================================================================================================
func getUniqueId(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	prefix := ""	
	if strings.ToLower(option) == "received" {
		prefix = "PRID-"
		allBAsBytes, err := stub.GetState("allProcessorReceivedIds")
		if err != nil {
			return shim.Error("Failed to get all Abattoir Received")
		}
		var res AllProcessorReceivedIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Processing Company Received Ids")
		}
		uniqueId := ""
		if len(res.ProcessorReceiptNumbers) != 0 {
			uniqueId = res.ProcessorReceiptNumbers[len(res.ProcessorReceiptNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "process" {
		prefix = "PIID-"
		allBAsBytes, err := stub.GetState("allProcessingTransactionIds")
		if err != nil {
			return shim.Error("Failed to get all Processing company Batch Codes")
		}
		var res AllProcessingTransactionIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Processing company Batch Codes records")
		}
		uniqueId := ""
		if len(res.ProcessorBatchCodes) != 0 {
			uniqueId = res.ProcessorBatchCodes[len(res.ProcessorBatchCodes) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "dispatch" {
		prefix = "PDID-"
		allBAsBytes, err := stub.GetState("allProcessorDispatchIds")
		if err != nil {
			return shim.Error("Failed to get all Processing company dispatch consignment numbers")
		}
	
		var res AllProcessorDispatchIds
		err = json.Unmarshal(allBAsBytes, &res)
		//fmt.Println(allBAsBytes);
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Processing company dispatch records")
		}
		uniqueId := ""
		if len(res.ConsignmentNumbers) != 0 {
			uniqueId = res.ConsignmentNumbers[len(res.ConsignmentNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "logistic" {
		prefix = "P2ILID-"
		allBAsBytes, err := stub.GetState("allLogisticTransactionIds")
		if err != nil {
			return shim.Error("Failed to get all Abattoir Received")
		}
		var res AllLogisticTransactionIds
		err = json.Unmarshal(allBAsBytes, &res)
		if err != nil {
			fmt.Println("Printing Unmarshal error:-");
			fmt.Println(err);
			return shim.Error("Failed to Unmarshal all Logistic Transactions records")
		}
		uniqueId := ""
		if len(res.ConsignmentNumbers) != 0 {
			uniqueId = res.ConsignmentNumbers[len(res.ConsignmentNumbers) - 1]
			p := strings.Split(uniqueId, "-")
			
			input, e := strconv.Atoi(p[1])
			if e != nil {
				fmt.Println(e)
			}
			output := (input + 1)
			uniqueId = prefix + strconv.Itoa(output)
			
		} else {
			uniqueId = prefix +"1000"
		}
		rabAsBytes, _ := json.Marshal(uniqueId)
		return shim.Success(rabAsBytes)	
	}

	return shim.Success(nil)
}

// ============================================================================================================================
// Get All Abattoir Received
// ============================================================================================================================
func getAllIkeaPOs(stub  shim.ChaincodeStubInterface, option string, value string) pb.Response {
	fmt.Println("getAllIkeaPOs:Looking for All Abattoir Received");

	//get the AllAllIkeaPOs index
	allBAsBytes, err := stub.GetState("allIkeaPOs")
	if err != nil {
		return shim.Error("Failed to get all Abattoir Received")
	}

	var res AllIkeaPOs
	err = json.Unmarshal(allBAsBytes, &res)
	//fmt.Println(allBAsBytes);
	if err != nil {
		fmt.Println("Printing Unmarshal error:-");
		fmt.Println(err);
		return shim.Error("Failed to Unmarshal all processor POs")
	}
	var allIkeaPOs AllIkeaPOs
	if strings.ToLower(option) == "po" || strings.ToLower(option) == "so" {
		for i := range res.IkeaPOs{
			if strings.ToLower(option) == "po" && strings.ToLower(res.IkeaPOs[i].IkeaPurchaseOrderNumber) == strings.ToLower(value) {
				allIkeaPOs.IkeaPOs = append(allIkeaPOs.IkeaPOs,res.IkeaPOs[i]);	
			} else if strings.ToLower(option) == "so" && strings.ToLower(res.IkeaPOs[i].SalesOrder) == strings.ToLower(value) {
				allIkeaPOs.IkeaPOs = append(allIkeaPOs.IkeaPOs,res.IkeaPOs[i]);	
			}		
		}
		rabAsBytes, _ := json.Marshal(allIkeaPOs)
		return shim.Success(rabAsBytes)	
	} else if strings.ToLower(option) == "details" {
		rabAsBytes, _ := json.Marshal(res)		
		return shim.Success(rabAsBytes)		
	}
	return shim.Success(nil)
}