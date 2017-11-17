import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

@Component({
  selector: 'app-logistic-inward',
  templateUrl: './logistic-inward.component.html',
  styleUrls: ['./logistic-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticInwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransaction: AbattoirModels.LogisticTransaction = new AbattoirModels.LogisticTransaction();
  abattoirDispatch: AbattoirModels.AbattoirDispatch = new AbattoirModels.AbattoirDispatch();
  abattoirDispatchList: Array<AbattoirModels.AbattoirDispatch> = new Array<AbattoirModels.AbattoirDispatch>();
  dispatchDateTime: any;
  expectedDeliveryDateTime: any;
  actualDeliveryDateTime: any;
  constructor(private user: UserService,
              private abattoirService: AbattoirService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllAbattoirDispatch('DETAILS')
    .then((results: any) => {
      this.abattoirDispatchList = <Array<AbattoirModels.AbattoirDispatch>>results.abattoirMaterialDispatch;
    });
  }

  ngOnInit() {
  }

  setRoute(){      
  }

  saveLogisticTransaction(){
    this.logisticTransaction.updatedBy = this.currentUser.id;
    this.logisticTransaction.updatedOn = new Date();
    this.logisticTransaction.logisticId = this.currentUser.id;
    this.logisticTransaction.logisticType = this.currentUser.type;
    this.logisticTransaction.dispatchDateTime.setHours(this.dispatchDateTime.hour);
    this.logisticTransaction.dispatchDateTime.setMinutes(this.dispatchDateTime.minute);
    this.logisticTransaction.expectedDeliveryDateTime.setHours(this.expectedDeliveryDateTime.hour);
    this.logisticTransaction.expectedDeliveryDateTime.setMinutes(this.expectedDeliveryDateTime.minute);
    //this.logisticTransaction.actualDeliveryDateTime.setHours(this.actualDeliveryDateTime.hour);
    //this.logisticTransaction.actualDeliveryDateTime.setMinutes(this.actualDeliveryDateTime.minute);
    this.logisticTransaction.currentStatus = "PickedUp";
    this.abattoirService.saveLogisticTransaction(this.logisticTransaction)
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
    this.dispatchDateTime= null;
    this.expectedDeliveryDateTime= null;
    this.logisticTransaction = new AbattoirModels.LogisticTransaction();    
  }
}

