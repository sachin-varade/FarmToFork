import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

@Component({
  selector: 'app-logistic-outward',
  templateUrl: './logistic-outward.component.html',
  styleUrls: ['./logistic-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticOutwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransaction: AbattoirModels.LogisticTransaction = new AbattoirModels.LogisticTransaction();
  actualDeliveryDateTime: any;
  constructor(private route: ActivatedRoute,
              private user: UserService,
              private abattoirService: AbattoirService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();   
    this.route.params.subscribe(params => {
      this.abattoirService.getAllLogisticTransactions('id',  params['consignmentNumber'])
      .then((results: any) => {
        this.logisticTransaction = <AbattoirModels.LogisticTransaction>results.logisticTransactions[0];        
      });
   }); 
    
  }

  ngOnInit() {    
  }

  saveLogisticTransaction(){
    this.logisticTransaction.updatedBy = this.currentUser.id;
    this.logisticTransaction.updatedOn = new Date();
    this.logisticTransaction.logisticId = this.currentUser.id;
    if (this.logisticTransaction.actualDeliveryDateTime && this.actualDeliveryDateTime){
      this.logisticTransaction.actualDeliveryDateTime.setHours(this.actualDeliveryDateTime.hour);
      this.logisticTransaction.actualDeliveryDateTime.setMinutes(this.actualDeliveryDateTime.minute);        
    }    
    this.abattoirService.updateLogisticTransactionStatus(this.logisticTransaction)
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
    this.actualDeliveryDateTime= null;
    this.logisticTransaction = new AbattoirModels.LogisticTransaction();    
  }
}
