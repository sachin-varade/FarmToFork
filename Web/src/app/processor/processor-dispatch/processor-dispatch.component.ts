import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { ProcessorService } from '../../processor.service';
import { LogisticService } from '../../logistic.service';
import * as ProcessorModels from '../../models/processor';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-processor-dispatch',
  templateUrl: './processor-dispatch.component.html',
  styleUrls: ['./processor-dispatch.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorDispatchComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  processingTransactionList: Array<ProcessorModels.ProcessingTransaction> = new Array<ProcessorModels.ProcessingTransaction>();
  processorDispatch : ProcessorModels.ProcessorDispatch = new ProcessorModels.ProcessorDispatch();
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private processorService: ProcessorService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getAllProcessingTransactions('details')
    .then((results: any) => {
      this.processingTransactionList = <Array<ProcessorModels.ProcessingTransaction>>results.processingTransaction;
      this.setDefaultValues();
    });   
    this.processorService.getUniqueId('dispatch')
    .then((results: any) => {
      this.processorDispatch.consignmentNumber = results;
    });  
  }

  ngOnInit() {
  }

  getProductDetails(){
    var self = this;
    if(!this.processingTransactionList){
      return;
    }
    this.processorService.getAllProcessorReceived('id', this.processingTransactionList.filter(function(o){return o.processorBatchCode === self.processorDispatch.processorBatchCode})[0].processorReceiptNumber )
    .then((results: any) => {
      this.logisticService.getAllLogisticTransactions('id', results.processorReceived[0].consignmentNumber)
      .then((results: any) => {
        console.log(results);
        this.processorDispatch.temperatureStorageMin = results.logisticTransactions[0].temperatureStorageMin;
        this.processorDispatch.temperatureStorageMax = results.logisticTransactions[0].temperatureStorageMax;
      }); 
    });
  }

  setGuid() {
    this.commonData.processorDispatchProducts.forEach(element => {
      if(element.code == this.processorDispatch.guidNumber){
        this.processorDispatch.materialName = element.name;
      }
    });
  }

  saveProcessorDispatch(myForm: NgForm){
    this.processorDispatch.updatedBy = this.currentUser.id;
    this.processorDispatch.updatedOn = new Date();
    this.processorDispatch.processorId = this.currentUser.id;
    this.processorService.saveProcessorDispatch(this.processorDispatch)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Meatball Manufacturer dispatch saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.processorDispatch = new ProcessorModels.ProcessorDispatch();    
  }

  setDefaultValues(){
    if(this.processingTransactionList && this.processingTransactionList.length > 0){
      this.processorDispatch.processorBatchCode = this.processingTransactionList[this.processingTransactionList.length-1].processorBatchCode;
    }
    
    this.getProductDetails();
    this.processorDispatch.guidNumber = this.commonData.processorDispatchProducts[0].code;
    this.setGuid();
    this.processorDispatch.materialGrade = this.commonData.materialGrades[0];
    this.processorDispatch.packagingDate = new Date();
    this.processorDispatch.usedByDate = new Date();
    this.processorDispatch.usedByDate.setDate(new Date().getDate()+10);  
    this.processorDispatch.quantity = 10;
    this.processorDispatch.quantityUnit = this.commonData.units[0];
    this.processorDispatch.qualityControlDocument = "Quality control documents verified";
    this.processorDispatch.storage = this.commonData.storage[0];
  }
}
