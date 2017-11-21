import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import { ProcessorService } from '../../processor.service';
import * as AbattoirModels from '../../models/abattoir';
import * as ProcessorModels from '../../models/processor';

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
    private abattoirService: AbattoirService,
    private processorService: ProcessorService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.processorReceivedList = <Array<ProcessorModels.ProcessorReceived>>results.processorReceived;
    }); 
    this.commonData.processingActions.forEach(element => {
      element.checked = false;
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

  saveProcessingTransaction(){
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
        this.clearForm();
        alert("Saved successfully.....");
      }
      else{
        alert("Error Occured.....");
      }
    });
  }

  clearForm(){
    this.commonData.processingActions.forEach(element => {
      element.checked = false;      
    });
    this.processingTransaction = new ProcessorModels.ProcessingTransaction();    
  }
}

