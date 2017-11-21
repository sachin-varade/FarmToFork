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
  selector: 'app-processor-inward',
  templateUrl: './processor-inward.component.html',
  styleUrls: ['./processor-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProcessorInwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransactionList: Array<AbattoirModels.LogisticTransaction> = new Array<AbattoirModels.LogisticTransaction>();
  processorReceived : ProcessorModels.ProcessorReceived = new ProcessorModels.ProcessorReceived();
  constructor(private user: UserService,
    private abattoirService: AbattoirService,
    private processorService: ProcessorService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<AbattoirModels.LogisticTransaction>>results.logisticTransactions;
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
  
  saveProcessorReceived(){
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
        this.clearForm();
        alert("Saved successfully.....");
      }
      else{
        alert("Error Occured.....");
      }
    });
  }

  clearForm(){
    this.commonData.processorAcceptanceCriteria.forEach(element => {
      element.conditionSatisfied = false;      
    });
    this.processorReceived = new ProcessorModels.ProcessorReceived();    
  }
}
