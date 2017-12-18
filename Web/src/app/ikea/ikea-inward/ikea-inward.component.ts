import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { LogisticService } from '../../logistic.service';
import { ProcessorService } from '../../processor.service';
import { IkeaService } from '../../ikea.service';
import * as LogisticModels from '../../models/logistic';
import * as IkeaModels from '../../models/ikea';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-ikea-inward',
  templateUrl: './ikea-inward.component.html',
  styleUrls: ['./ikea-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class IkeaInwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransactionList: Array<LogisticModels.LogisticTransaction> = new Array<LogisticModels.LogisticTransaction>();
  logisticTransaction: LogisticModels.LogisticTransaction = new LogisticModels.LogisticTransaction();
  ikeaReceived : IkeaModels.IkeaReceived = new IkeaModels.IkeaReceived();
  receivedDateTime: any;
  usedByDateTime: any;
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private ikeaService: IkeaService,
    private processorService: ProcessorService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.logisticService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<LogisticModels.LogisticTransaction>>results.logisticTransactions;
      //this.setDefaultValues();
    });  
    this.ikeaService.getUniqueId('received')
    .then((results: any) => {
      this.ikeaReceived.ikeaReceivedNumber = results;
    });   
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.processingTransactionProducts.forEach(element => {
      if(element.code == this.ikeaReceived.guidNumber){
        this.ikeaReceived.materialName = element.name;
      }
    });
  }
  
  saveIkeaReceived(myForm: NgForm){
    this.ikeaReceived.updatedBy = this.currentUser.id;
    this.ikeaReceived.updatedOn = new Date();
    this.ikeaReceived.ikeaId = this.currentUser.id;
    this.ikeaReceived.acceptanceCheckList = new Array<IkeaModels.AcceptanceCriteria>();

    this.commonData.ikeaAcceptanceCriteria.forEach(element => {
      if (element.conditionSatisfied === true){
        this.ikeaReceived.acceptanceCheckList.push(element)
      }
    });
    this.ikeaReceived.receivedDate.setHours(this.receivedDateTime.hour);
    this.ikeaReceived.receivedDate.setMinutes(this.receivedDateTime.minute);
    this.ikeaReceived.usedByDate.setHours(this.usedByDateTime.hour);
    this.ikeaReceived.usedByDate.setMinutes(this.usedByDateTime.minute);
    
    this.ikeaService.saveIkeaReceived(this.ikeaReceived)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Kitchen receipt saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.commonData.ikeaAcceptanceCriteria.forEach(element => {
      element.conditionSatisfied = false;      
    });
    this.ikeaReceived = new IkeaModels.IkeaReceived(); 
    this.logisticTransaction = new LogisticModels.LogisticTransaction();   
  }

  checkLogisticConsignment(){
    var obj= this;
    if(!this.logisticTransactionList){
      return;
    }
    this.logisticTransaction = this.logisticTransactionList.filter(function(o){return o.consignmentNumber === obj.ikeaReceived.consignmentNumber})[0];
    if(this.logisticTransaction.iotTemperatureHistory && this.logisticTransaction.iotTemperatureHistory.length > 0){
      this.ikeaReceived.transportConsitionSatisfied = "false";
    }
    else{
      this.ikeaReceived.transportConsitionSatisfied = "true";
    }
    this.ikeaReceived.quantityUnit = this.logisticTransaction.quantityUnit;
    this.ikeaReceived.quantity = this.logisticTransaction.quantity;
    var diff= new Date(new Date(this.logisticTransaction.actualDeliveryDateTime).getTime() - new Date(this.logisticTransaction.shipmentStatus[1].shipmentDate).getTime());
    this.ikeaReceived.transitTime = ( ((diff.getUTCDate()-1)*24) + diff.getUTCHours()).toString() +"."+ diff.getUTCMinutes().toString();
    this.ikeaReceived.receivedDate = this.logisticTransaction.actualDeliveryDateTime;
    this.ikeaReceived.usedByDate =new Date();
    this.ikeaReceived.usedByDate.setDate(new Date().getDate()+10);  
    this.processorService.getAllProcessorDispatch('id', this.logisticTransaction.processorConsignmentNumber)
    .then((results: any) => {      
      this.ikeaReceived.guidNumber = results.processorDispatch[0].guidNumber;
      this.setGuid();
      this.ikeaReceived.materialGrade = results.processorDispatch[0].materialGrade;
      this.ikeaReceived.usedByDate =results.processorDispatch[0].usedByDate;
      this.receivedDateTime = {hour: new Date(this.ikeaReceived.receivedDate).getHours(), minute: new Date(this.ikeaReceived.receivedDate).getMinutes()};
      this.usedByDateTime = {hour: new Date(this.ikeaReceived.usedByDate).getHours(), minute: new Date(this.ikeaReceived.usedByDate).getMinutes()};
    });
    
  }

  setDefaultValues(){
    this.processorService.getAllProcessorDispatch('po', this.ikeaReceived.purchaseOrderNumber +"^"+ this.currentUser.id)
    .then((results: any) => {

      if(results && results.processorDispatch && results.processorDispatch.length > 0){
        if(this.logisticTransactionList && this.logisticTransactionList.length>0){
          this.ikeaReceived.consignmentNumber = this.logisticTransactionList[this.logisticTransactionList.length-1].consignmentNumber;
        }    
        this.checkLogisticConsignment();    
        this.ikeaReceived.storage = this.commonData.storage[0];
      }
      else{
        this.alertService.error("Purchase Order Number- "+ this.ikeaReceived.purchaseOrderNumber +" is not created by you. Please use another Purchase Order Number");
        this.ikeaReceived.purchaseOrderNumber = "";
        return false;
      }
      
    }); 

    
  }
}
