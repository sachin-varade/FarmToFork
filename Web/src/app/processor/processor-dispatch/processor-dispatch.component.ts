import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { ProcessorService } from '../../processor.service';
import * as ProcessorModels from '../../models/processor';

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
    private processorService: ProcessorService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.processorService.getAllProcessingTransactions('details')
    .then((results: any) => {
      this.processingTransactionList = <Array<ProcessorModels.ProcessingTransaction>>results.processingTransaction;
    });     
  }

  ngOnInit() {
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
        alert("Saved successfully.....");
      }
      else{
        alert("Error Occured.....");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.processorDispatch = new ProcessorModels.ProcessorDispatch();    
  }
}
