import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { ProcessorService } from '../../processor.service';
import * as ProcessorModels from '../../models/processor';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-process-item',
  templateUrl: './process-item.component.html',
  styleUrls: ['./process-item.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessItemComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  processorReceivedList: Array<ProcessorModels.ProcessorReceived> = new Array<ProcessorModels.ProcessorReceived>();
  processingTransaction : ProcessorModels.ProcessingTransaction = new ProcessorModels.ProcessingTransaction();
  constructor(private user: UserService,
    private processorService: ProcessorService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getAllProcessorReceived('details')
    .then((results: any) => {
      this.processorReceivedList = <Array<ProcessorModels.ProcessorReceived>>results.processorReceived;
      this.setDefaultValues();
    }); 
    this.commonData.processingActions.forEach(element => {
      element.checked = true;
    });  
    this.processorService.getUniqueId('process')
    .then((results: any) => {
      this.processingTransaction.processorBatchCode = results;
    }); 
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.processingTransactionProducts.forEach(element => {
      if(element.code == this.processingTransaction.guidNumber){
        this.processingTransaction.materialName = element.name;
      }
    });
  }

  saveProcessingTransaction(myForm: NgForm){
    this.processingTransaction.updatedBy = this.currentUser.id;
    this.processingTransaction.updatedOn = new Date();
    this.processingTransaction.processorId = this.currentUser.id;
    this.processingTransaction.processingAction = new Array<ProcessorModels.ProcessingAction>();
    this.commonData.processingActions.forEach(element => {
      if (element.checked === true){
        this.processingTransaction.processingAction.push(element)
      }
    });
    this.processorService.saveProcessingTransaction(this.processingTransaction)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Process item saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.processingTransaction = new ProcessorModels.ProcessingTransaction();    
    setTimeout(() => {
      this.commonData.processingActions.forEach(element => {
        element.checked = true;      
      });      
    }, 10);    
  }

  setDefaultValues(){
    if(this.processorReceivedList && this.processorReceivedList.length){
      this.processingTransaction.processorReceiptNumber = this.processorReceivedList[this.processorReceivedList.length-1].processorReceiptNumber;
    }
    
    this.processingTransaction.guidNumber = this.commonData.processingTransactionProducts[0].code;
    this.setGuid();
    this.processingTransaction.materialGrade = this.commonData.materialGrades[0];
    this.processingTransaction.usedByDate = new Date();
    this.processingTransaction.usedByDate.setDate(new Date().getDate()+10);  
    this.processingTransaction.quantity = 10;
    this.processingTransaction.quantityUnit = this.commonData.units[0];
    this.processingTransaction.qualityControlDocument = "testing...";
    this.processingTransaction.storage = this.commonData.storage[0];
  }
}

