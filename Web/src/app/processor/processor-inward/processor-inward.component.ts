import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { LogisticService } from '../../logistic.service';
import { ProcessorService } from '../../processor.service';
import * as LogisticModels from '../../models/logistic';
import * as ProcessorModels from '../../models/processor';
import { AlertService } from '../../alert.service';
import { AbattoirService } from '../../abattoir.service';

@Component({
  selector: 'app-processor-inward',
  templateUrl: './processor-inward.component.html',
  styleUrls: ['./processor-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorInwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransactionList: Array<LogisticModels.LogisticTransaction> = new Array<LogisticModels.LogisticTransaction>();
  logisticTransaction: LogisticModels.LogisticTransaction = new LogisticModels.LogisticTransaction();
  processorReceived : ProcessorModels.ProcessorReceived = new ProcessorModels.ProcessorReceived();
  receivedDateTime: any;
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private processorService: ProcessorService,
    private abattoirService: AbattoirService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getUniqueId('received')
    .then((results: any) => {
      this.processorReceived.processorReceiptNumber = results;
    });
    this.logisticService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<LogisticModels.LogisticTransaction>>results.logisticTransactions;      
    });    
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.abattoirsProducts.forEach(element => {
      if(element.code == this.processorReceived.guidNumber){
        this.processorReceived.materialName = element.name;
      }
    });
  }
  
  saveProcessorReceived(myForm: NgForm){
    this.processorReceived.updatedBy = this.currentUser.id;
    this.processorReceived.updatedOn = new Date();
    this.processorReceived.processorId = this.currentUser.id;
    this.processorReceived.acceptanceCheckList = new Array<ProcessorModels.AcceptanceCriteria>();
    this.commonData.processorAcceptanceCriteria.forEach(element => {
      if (element.conditionSatisfied === true){
        this.processorReceived.acceptanceCheckList.push(element)
      }
    });
    this.processorReceived.receivedDate.setHours(this.receivedDateTime.hour);
    this.processorReceived.receivedDate.setMinutes(this.receivedDateTime.minute);
    this.processorService.saveProcessorReceived(this.processorReceived)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Meatball Manufacturer receipt saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.commonData.processorAcceptanceCriteria.forEach(element => {
      element.conditionSatisfied = false;      
    });
    this.processorReceived = new ProcessorModels.ProcessorReceived();    
    this.logisticTransaction = new LogisticModels.LogisticTransaction();
  }

  checkLogisticConsignment(){
    if(!this.logisticTransactionList){
      return;
    }
    var obj= this;
    this.logisticTransaction = this.logisticTransactionList.filter(function(o){return o.consignmentNumber === obj.processorReceived.consignmentNumber})[0];
    if(this.logisticTransaction.iotTemperatureHistory && this.logisticTransaction.iotTemperatureHistory.length > 0){
      this.processorReceived.transportConsitionSatisfied = "false";
    }
    else{
      this.processorReceived.transportConsitionSatisfied = "true";
    }
    this.logisticTransaction.logisticName = this.userData.users.logistics.filter(function(o){return o.id == Number(obj.logisticTransaction.logisticId)})[0].displayName;
    this.processorReceived.quantityUnit = this.logisticTransaction.quantityUnit;
    this.processorReceived.quantity = this.logisticTransaction.quantity;
    var diff= new Date(new Date(this.logisticTransaction.actualDeliveryDateTime).getTime() - new Date(this.logisticTransaction.shipmentStatus[1].shipmentDate).getTime());
    this.processorReceived.transitTime = ( ((diff.getUTCDate()-1)*24) + diff.getUTCHours()).toString() +"."+ diff.getUTCMinutes().toString();
    this.processorReceived.receivedDate = this.logisticTransaction.actualDeliveryDateTime;
    this.receivedDateTime = {hour: new Date(this.processorReceived.receivedDate).getHours(), minute: new Date(this.processorReceived.receivedDate).getMinutes()};
    this.processorReceived.usedByDate =new Date();
    this.processorReceived.usedByDate.setDate(new Date().getDate()+10); 
    this.abattoirService.getAllAbattoirDispatch('id', this.logisticTransaction.abattoirConsignmentNumber)
    .then((results: any) => {
      this.processorReceived.guidNumber = results.abattoirMaterialDispatch[0].guidNumber;
      this.setGuid();
      this.processorReceived.materialGrade = results.abattoirMaterialDispatch[0].materialGrade;
      this.processorReceived.fatCoverClass = results.abattoirMaterialDispatch[0].fatCoverClass;
    }); 
  }

  setDefaultValues(){
    this.abattoirService.getAllAbattoirDispatch('po', this.processorReceived.purchaseOrderNumber +"^"+ this.currentUser.id)
    .then((results: any) => {

      if(results && results.abattoirMaterialDispatch && results.abattoirMaterialDispatch.length > 0){
        if(this.logisticTransactionList && this.logisticTransactionList.length > 0){
          this.processorReceived.consignmentNumber = this.logisticTransactionList[this.logisticTransactionList.length-1].consignmentNumber;
        }
        
        this.checkLogisticConsignment();
        this.processorReceived.storage = this.commonData.storage[0];
        //this.receivedDateTime = {hour: 10, minute: 15};
      }
      else{
        this.alertService.error("Purchase Order Number- "+ this.processorReceived.purchaseOrderNumber +" is not created by you. Please use another Purchase Order Number");
        this.processorReceived.purchaseOrderNumber = "";
        return false;
      }
      
    }); 
  }
}
