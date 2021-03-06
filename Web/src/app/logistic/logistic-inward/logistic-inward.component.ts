import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import { LogisticService } from '../../logistic.service';
import { ProcessorService } from '../../processor.service';
import * as AbattoirModels from '../../models/abattoir';
import * as LogisticModels from '../../models/logistic';
import * as ProcessorModels from '../../models/processor';
import { forEach } from '@angular/router/src/utils/collection';
import { AlertService } from '../../alert.service';
import * as moment from 'moment';

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
  processorDispatchList: Array<ProcessorModels.ProcessorDispatch> = new Array<ProcessorModels.ProcessorDispatch>();
  node1Date: any;
  node1DateTime: any;
  node2Date: any;
  node2DateTime: any;
  node3Date: any;
  node3DateTime: any;
  constructor(private user: UserService,
              private abattoirService: AbattoirService,
              private logisticService: LogisticService,
            private processorService: ProcessorService,
          private alertService: AlertService,
          @Inject(DOCUMENT) private document) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllAbattoirDispatch('details')
    .then((results: any) => {
      this.abattoirDispatchList = <Array<AbattoirModels.AbattoirDispatch>>results.abattoirMaterialDispatch;      
      this.processorService.getAllProcessorDispatch('details')
      .then((results: any) => {
        this.processorDispatchList = <Array<ProcessorModels.ProcessorDispatch>>results.processorDispatch;
        this.logisticService.getUniqueId('logistic')
        .then((results: any) => {
          this.logisticTransaction.consignmentNumber = results;
          this.fetchConsignment(this.document.getElementById('myForm'));
        });   
      });
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
        //this.clearForm(myForm);
        this.alertService.success("Consignment saved.");
        this.iotMinTemp = Number(this.logisticTransaction.temperatureStorageMin);
        this.iotMaxTemp = Number(this.logisticTransaction.temperatureStorageMax);        
      }
      else{
        this.alertService.error("Error occured...");
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
        if(!results || !results.logisticTransactions || (results.logisticTransactions[0] && results.logisticTransactions[0].currentStatus === '')){
          this.logisticTransaction = new LogisticModels.LogisticTransaction();
          this.logisticTransaction.currentStatus = "";
          this.logisticTransaction.consignmentNumber = _consignmentNumber;
          this.setDefaultValues();
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
        this.alertService.success("Consignment updated.");
      }
      else{
        this.alertService.error("Error occured...");
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
      //var temp = Math.floor((Math.random() * Number(this.iotMaxTemp+5)) + Number(this.iotMinTemp-5));
      //var temp = Math.floor((Math.random() * Number(this.iotMinTemp-5)) + Number(this.iotMaxTemp+5));
      var temp = Math.floor(Math.random() * ((this.iotMaxTemp+5) - (this.iotMinTemp-5) + 1) + (this.iotMinTemp-5));
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
    if(this.iotData[ind].temp < this.logisticTransaction.temperatureStorageMin || this.iotData[ind].temp > this.logisticTransaction.temperatureStorageMax){
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
            this.alertService.success("Discrepancies in Temperature pushed.");
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
        this.alertService.success("Discrepancies in Temperature pushed.");
        this.showDialog = !this.showDialog;
        this.fetchConsignment(null);
      }
    }
  }

  setTemp(){
    var obj: any = this.currentUser.type === 'A2P' ? this.abattoirDispatchList[this.abattoirDispatchList.length-1] : this.processorDispatchList[this.processorDispatchList.length-1];
    this.logisticTransaction.temperatureStorageMin = obj.temperatureStorageMin;
    this.logisticTransaction.temperatureStorageMax = obj.temperatureStorageMax;
    this.logisticTransaction.quantityUnit = obj.quantityUnit;
    this.logisticTransaction.quantity = obj.quantity;
  }

  setDefaultValues(){
    
    if(this.abattoirDispatchList && this.abattoirDispatchList.length){
      this.logisticTransaction.abattoirConsignmentNumber =  this.abattoirDispatchList[this.abattoirDispatchList.length-1].consignmentNumber;
      this.logisticTransaction.routeId = this.commonData.routes[0].id;
    }
    
    if(this.processorDispatchList && this.processorDispatchList.length){
      this.logisticTransaction.processorConsignmentNumber = this.processorDispatchList[this.processorDispatchList.length-1].consignmentNumber;
      this.logisticTransaction.routeId = this.commonData.routes[1].id;
    }
    
    this.logisticTransaction.vehicleId = this.commonData.vehicles[0].id;
    this.logisticTransaction.vehicleTypeId = this.commonData.vehicleTypes[0].id;
    this.setTemp();
    this.logisticTransaction.handlingInstruction = "Temperature should be maintained";
    this.logisticTransaction.dispatchDateTime = new Date();
    this.dispatchDateTime = {hour:1, minute: 10};
    this.logisticTransaction.inTransitDateTime = new Date();
    this.inTransitDateTime = {hour:3, minute: 10};
    this.logisticTransaction.expectedDeliveryDateTime = new Date();
    this.logisticTransaction.expectedDeliveryDateTime.setDate(new Date().getDate()+1);
    this.expectedDeliveryDateTime = {hour:1, minute: 10};
    this.logisticTransaction.actualDeliveryDateTime = new Date();
    this.logisticTransaction.actualDeliveryDateTime.setDate(new Date().getDate()+1);
    this.actualDeliveryDateTime = {hour:1, minute: 0};    

    this.logisticTransaction.inTransitDateTime.setHours(this.inTransitDateTime.hour);
    this.logisticTransaction.inTransitDateTime.setMinutes(this.inTransitDateTime.minute);
    this.logisticTransaction.actualDeliveryDateTime.setHours(this.actualDeliveryDateTime.hour);
    this.logisticTransaction.actualDeliveryDateTime.setMinutes(this.actualDeliveryDateTime.minute);
    
    var diff= new Date(new Date(this.logisticTransaction.actualDeliveryDateTime).getTime() - new Date(this.logisticTransaction.inTransitDateTime).getTime());
    var transitTime = ( ((diff.getUTCDate()-1)*24) + diff.getUTCHours()).toString() +"."+ diff.getUTCMinutes().toString();
    // this.node1Date = new Date(moment(this.logisticTransaction.inTransitDateTime).add((Number(transitTime)/2),'h').toString());
    // this.node1DateTime = {hour: this.node1Date.getHours(), minute: this.node1Date.getMinutes()};
    this.node1Date = this.logisticTransaction.inTransitDateTime;
    this.node1DateTime = this.inTransitDateTime;    
    this.node2Date = new Date(moment(this.node1Date).add((Number(transitTime)/2),'h').toString());
    this.node2DateTime = {hour: this.node2Date.getHours(), minute: this.node2Date.getMinutes()};
    // this.node3Date = new Date(moment(this.node2Date).add((Number(transitTime)/2),'h').toString());
    // this.node3DateTime = {hour: this.node3Date.getHours(), minute: this.node3Date.getMinutes()};
    this.node3Date = this.logisticTransaction.actualDeliveryDateTime;
    this.node3DateTime = this.actualDeliveryDateTime;
  }
}

