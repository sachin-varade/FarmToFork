import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import { LogisticService } from '../../logistic.service';
import * as AbattoirModels from '../../models/abattoir';
import * as LogisticModels from '../../models/logistic';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-logistic-inward',
  templateUrl: './logistic-inward.component.html',
  styleUrls: ['./logistic-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticInwardComponent implements OnInit {
  showDialog: boolean = false;
  iotData: Array<any> = new Array<any>();
  iotMinTemp: number = 0;
  iotMaxTemp: number = 0;
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransaction: LogisticModels.LogisticTransaction = new LogisticModels.LogisticTransaction();
  abattoirDispatch: AbattoirModels.AbattoirDispatch = new AbattoirModels.AbattoirDispatch();
  abattoirDispatchList: Array<AbattoirModels.AbattoirDispatch> = new Array<AbattoirModels.AbattoirDispatch>();
  dispatchDateTime: any;
  inTransitDateTime: any;
  expectedDeliveryDateTime: any;
  actualDeliveryDateTime: any;
  constructor(private user: UserService,
              private abattoirService: AbattoirService,
              private logisticService: LogisticService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllAbattoirDispatch('details')
    .then((results: any) => {
      this.abattoirDispatchList = <Array<AbattoirModels.AbattoirDispatch>>results.abattoirMaterialDispatch;
    });
    this.logisticTransaction.currentStatus = "";    
  }

  ngOnInit() {
  }

  setRoute(){      
  }

  saveLogisticTransaction(myForm: NgForm){
    this.logisticTransaction.updatedBy = this.currentUser.id;
    this.logisticTransaction.updatedOn = new Date();
    this.logisticTransaction.logisticId = this.currentUser.id;
    this.logisticTransaction.logisticType = this.currentUser.type;
    this.logisticTransaction.dispatchDateTime.setHours(this.dispatchDateTime.hour);
    this.logisticTransaction.dispatchDateTime.setMinutes(this.dispatchDateTime.minute);
    this.logisticTransaction.expectedDeliveryDateTime.setHours(this.expectedDeliveryDateTime.hour);
    this.logisticTransaction.expectedDeliveryDateTime.setMinutes(this.expectedDeliveryDateTime.minute);
    this.logisticTransaction.inTransitDateTime.setHours(this.inTransitDateTime.hour);
    this.logisticTransaction.inTransitDateTime.setMinutes(this.inTransitDateTime.minute);
    this.logisticTransaction.actualDeliveryDateTime.setHours(this.actualDeliveryDateTime.hour);
    this.logisticTransaction.actualDeliveryDateTime.setMinutes(this.actualDeliveryDateTime.minute);
    this.logisticTransaction.currentStatus = "PickedUp";
    this.logisticService.saveLogisticTransaction(this.logisticTransaction)
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

  fetchConsignment(myForm: NgForm){
    var _consignmentNumber = this.logisticTransaction.consignmentNumber;
    if(this.logisticTransaction.consignmentNumber && this.logisticTransaction.consignmentNumber !== ''){
      this.logisticService.getAllLogisticTransactions('id', this.logisticTransaction.consignmentNumber)
      .then((results: any) => {
        this.dispatchDateTime = null;
        this.expectedDeliveryDateTime = null;
        this.inTransitDateTime = null;
        this.actualDeliveryDateTime= null;
        if(!results || !results.logisticTransactions){
          this.logisticTransaction = new LogisticModels.LogisticTransaction();
          this.logisticTransaction.currentStatus = "";
          this.logisticTransaction.consignmentNumber = _consignmentNumber;
        }
        else{
          this.dispatchDateTime = {};
          this.expectedDeliveryDateTime = {};
          this.inTransitDateTime = {};
          this.actualDeliveryDateTime= {};
          this.logisticTransaction = <LogisticModels.LogisticTransaction>results.logisticTransactions[0]; 
          this.logisticTransaction.inTransitDateTime= this.logisticTransaction.shipmentStatus[1].shipmentDate;          
          this.dispatchDateTime.hour = new Date(this.logisticTransaction.dispatchDateTime).getHours();
          this.dispatchDateTime.minute = new Date(this.logisticTransaction.dispatchDateTime).getMinutes();
          this.expectedDeliveryDateTime.hour = new Date(this.logisticTransaction.expectedDeliveryDateTime).getHours();
          this.expectedDeliveryDateTime.minute = new Date(this.logisticTransaction.expectedDeliveryDateTime).getMinutes();
          this.inTransitDateTime.hour = new Date(this.logisticTransaction.inTransitDateTime).getHours();
          this.inTransitDateTime.minute = new Date(this.logisticTransaction.inTransitDateTime).getMinutes();
          
          if (this.logisticTransaction.actualDeliveryDateTime){            
            this.actualDeliveryDateTime.hour = new Date(this.logisticTransaction.actualDeliveryDateTime).getHours();
            this.actualDeliveryDateTime.minute = new Date(this.logisticTransaction.actualDeliveryDateTime).getMinutes();
          }  
          this.iotMinTemp = Number(this.logisticTransaction.temperatureStorageMin);
          this.iotMaxTemp = Number(this.logisticTransaction.temperatureStorageMax);
         }
      });
    }
    else{
      this.clearForm(myForm);
      this.dispatchDateTime = null;
      this.expectedDeliveryDateTime = null;
      this.inTransitDateTime = null;
      this.actualDeliveryDateTime= null;
    }
  }

  makeIntransit(myForm: NgForm){
    this.logisticTransaction.currentStatus = "InTransit";
    this.updateLogisticTransactionStatus(myForm);
  }

  makeDelivered(myForm: NgForm){
    if (this.logisticTransaction.actualDeliveryDateTime && this.actualDeliveryDateTime){
      this.logisticTransaction.actualDeliveryDateTime.setHours(this.actualDeliveryDateTime.hour);
      this.logisticTransaction.actualDeliveryDateTime.setMinutes(this.actualDeliveryDateTime.minute);        
    }  
    this.logisticTransaction.currentStatus = "Delivered";
    this.updateLogisticTransactionStatus(myForm);
  }

  updateLogisticTransactionStatus(myForm: NgForm){
    this.logisticTransaction.updatedBy = this.currentUser.id;
    this.logisticTransaction.updatedOn = new Date();
    this.logisticTransaction.logisticId = this.currentUser.id;
    this.logisticService.updateLogisticTransactionStatus(this.logisticTransaction)
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
    this.dispatchDateTime = {};
    this.expectedDeliveryDateTime = {};
    this.inTransitDateTime = {};
    this.actualDeliveryDateTime= {};
    this.logisticTransaction = new LogisticModels.LogisticTransaction();   
    this.logisticTransaction.currentStatus = ""; 
    this.logisticTransaction.consignmentNumber = "";
  }

  populateIOTData(){
    this.iotData = new Array<any>();
    for(var i=0; i<5; i++){
      var temp = Math.floor((Math.random() * Number(this.iotMaxTemp)) + Number(this.iotMinTemp));
      var date = this.randomDate(this.logisticTransaction.inTransitDateTime, this.logisticTransaction.actualDeliveryDateTime);      
      this.iotData.push({temp: temp, date: date});
    }
    this.iotData = this.iotData.sort(function(a, b) {
      a = new Date(a.date);
      b = new Date(b.date);
      return a<b ? -1 : a>b ? 1 : 0;      
    });    
  }

  randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  pushIOTData(myForm: NgForm){
    this.pushIOT(0);    
  }
  pushIOT(ind){
    if(this.iotData[ind].temp < this.iotMinTemp || this.iotData[ind].temp > this.iotMaxTemp){
      this.iotData[ind].logisticId = this.currentUser.id;
      this.iotData[ind].consignmentNumber = this.logisticTransaction.consignmentNumber;
      this.iotData[ind].location = this.commonData.logisticsLocations[ind].name;
      this.logisticService.pushIotDetailsToLogisticTransaction(this.iotData[ind])
      .then((results: any) => {
        if(results[0].status.indexOf('SUCCESS') > -1){
          if(ind< (this.iotData.length-1)){
            this.pushIOT(ind+1);
          }
          else{
            this.showDialog = !this.showDialog;
            this.fetchConsignment(null);
          }
        }
      });
    }
    else{
      if(ind< (this.iotData.length-1)){
        this.pushIOT(ind+1);
      }
      else{
        this.showDialog = !this.showDialog;
        this.fetchConsignment(null);
      }
    }
    
  }
}

