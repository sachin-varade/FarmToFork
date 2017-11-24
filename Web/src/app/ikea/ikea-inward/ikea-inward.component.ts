import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { LogisticService } from '../../logistic.service';
import { IkeaService } from '../../ikea.service';
import * as LogisticModels from '../../models/logistic';
import * as IkeaModels from '../../models/ikea';

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
  ikeaReceived : IkeaModels.IkeaReceived = new IkeaModels.IkeaReceived();
  constructor(private user: UserService,
    private logisticService: LogisticService,
    private ikeaService: IkeaService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.logisticService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<LogisticModels.LogisticTransaction>>results.logisticTransactions;
    });    
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.ikeaInwardProducts.forEach(element => {
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
    this.ikeaService.saveIkeaReceived(this.ikeaReceived)
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
    this.commonData.ikeaAcceptanceCriteria.forEach(element => {
      element.conditionSatisfied = false;      
    });
    this.ikeaReceived = new IkeaModels.IkeaReceived();    
  }
}
