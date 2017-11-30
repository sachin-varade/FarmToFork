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
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private processorService: ProcessorService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.logisticService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<LogisticModels.LogisticTransaction>>results.logisticTransactions;
      this.setDefaultValues();
    });    
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.processorInwardProducts.forEach(element => {
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
    var obj= this;
    this.logisticTransaction = this.logisticTransactionList.filter(function(o){return o.consignmentNumber === obj.processorReceived.consignmentNumber})[0];
    if(this.logisticTransaction.iotTemperatureHistory && this.logisticTransaction.iotTemperatureHistory.length > 0){
      this.processorReceived.transportConsitionSatisfied = "false";
    }
    else{
      this.processorReceived.transportConsitionSatisfied = "true";
    }
    this.processorReceived.quantityUnit = this.logisticTransaction.quantityUnit;
    this.processorReceived.quantity = this.logisticTransaction.quantity;
    var diff= new Date(new Date(this.logisticTransaction.actualDeliveryDateTime).getTime() - new Date(this.logisticTransaction.shipmentStatus[1].shipmentDate).getTime());
    this.processorReceived.transitTime = ( ((diff.getUTCDate()-1)*24) + diff.getUTCHours()).toString() +"."+ diff.getUTCMinutes().toString();
    this.processorReceived.receivedDate = this.logisticTransaction.actualDeliveryDateTime;
    this.processorReceived.usedByDate =new Date();
    this.processorReceived.usedByDate.setDate(new Date().getDate()+10);  
  }

  setDefaultValues(){
    if(this.logisticTransactionList.length > 0){
      this.processorReceived.consignmentNumber = this.logisticTransactionList[this.logisticTransactionList.length-1].consignmentNumber;
    }
    
    this.checkLogisticConsignment();
    this.processorReceived.guidNumber = this.commonData.processorInwardProducts[0].code;
    this.setGuid();
    this.processorReceived.materialGrade = this.commonData.materialGrades[0];
    
  }
}
