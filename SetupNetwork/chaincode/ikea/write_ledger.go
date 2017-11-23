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

//Create Ikea Received block
func saveIkeaReceived(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveIkeaReceived..")

	if len(args) != 17 {
		fmt.Println("Incorrect number of arguments. Expecting 17")
		return shim.Error("Incorrect number of arguments. Expecting 17")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]+","+args[8]+","+args[9]+","+args[10]);

	var bt IkeaReceived
	bt.IkeaReceivedNumber				= args[0]
	bt.IkeaStoreId						= args[1]
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
	bt.Storage							= args[13]
	bt.UpdatedBy						= args[15]
	bt.UpdatedOn						= args[16]

	var acceptanceCriteria AcceptanceCriteria
	
	if args[14] != "" {
		p := strings.Split(args[14], ",")
		for i := range p {
			c := strings.Split(p[i], "^")
			acceptanceCriteria.Id 					= c[0]
			acceptanceCriteria.RuleCondition 		= c[1]
			acceptanceCriteria.ConditionSatisfied 	= c[2]
			bt.AcceptanceCheckList	= append(bt.AcceptanceCheckList, acceptanceCriteria)
		}
	}

	//Commit Inward entry to ledger
	fmt.Println("saveIkeaReceived - Commit Ikea Received To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.IkeaReceivedNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Ikea ReceivedIds Array
	allBAsBytes, err := stub.GetState("allIkeaReceivedIds")
	if err != nil {
		return shim.Error("Failed to get all Ikea Received Ids")
	}
	var allb AllIkeaReceivedIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Received")
	}
	allb.IkeaReceivedNumbers = append(allb.IkeaReceivedNumbers, bt.IkeaReceivedNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allIkeaReceivedIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


//Create Ikea Dispatch block
func saveIkeaDispatch(stub  shim.ChaincodeStubInterface, args []string) pb.Response {	
	var err error
	fmt.Println("Running saveIkeaDispatch..")

	if len(args) != 8 {
		fmt.Println("Incorrect number of arguments. Expecting 8")
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	fmt.Println("Arguments :"+args[0]+","+args[1]+","+args[2]+","+args[3]+","+args[4]+","+args[5]+","+args[6]+","+args[7]);

	var bt IkeaDispatch
	bt.IkeaDispatchNumber				= args[0]
	bt.IkeaStoreId						= args[1]
	bt.GUIDNumber						= args[2]
	bt.MaterialName						= args[3]
	bt.MaterialGrade					= args[4]	
	bt.Quantity							= args[5]
	bt.QuantityUnit						= args[6]	
	bt.DispatchDateTime					= args[7]


	//Commit Inward entry to ledger
	fmt.Println("saveIkeaDispatch - Commit Ikea Dispatch To Ledger");
	btAsBytes, _ := json.Marshal(bt)
	err = stub.PutState(bt.IkeaDispatchNumber, btAsBytes)
	if err != nil {		
		return shim.Error(err.Error())
	}

	//Update All Ikea DispatchIds Array
	allBAsBytes, err := stub.GetState("allIkeaDispatchIds")
	if err != nil {
		return shim.Error("Failed to get all Ikea Dispatch Ids")
	}
	var allb AllIkeaDispatchIds
	err = json.Unmarshal(allBAsBytes, &allb)
	if err != nil {
		return shim.Error("Failed to Unmarshal all Dispatch")
	}
	allb.IkeaDispatchNumbers = append(allb.IkeaDispatchNumbers, bt.IkeaDispatchNumber)

	allBuAsBytes, _ := json.Marshal(allb)
	err = stub.PutState("allIkeaDispatchIds", allBuAsBytes)
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}


