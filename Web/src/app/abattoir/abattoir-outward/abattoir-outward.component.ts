import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-abattoir-outward',
  templateUrl: './abattoir-outward.component.html',
  styleUrls: ['./abattoir-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirOutwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  abattoirReceived: AbattoirModels.AbattoirReceived = new AbattoirModels.AbattoirReceived();
  abattoirDispatch: AbattoirModels.AbattoirDispatch = new AbattoirModels.AbattoirDispatch();
  abattoirReceivedList: Array<AbattoirModels.AbattoirReceived> = new Array<AbattoirModels.AbattoirReceived>();
  dispatchDateTime: any;
  productionDateTime: any;
  allProcessorPOs: any;
  constructor(private user: UserService,
    private abattoirService: AbattoirService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();

    this.abattoirService.getAllAbattoirReceived('details')
    .then((results: any) => {
      this.abattoirReceivedList = <Array<AbattoirModels.AbattoirReceived>>results.abattoirMaterialReceived;      
    });
    this.abattoirDispatch.dispatchDate = new Date();
    this.userData.users.logistics = this.userData.users.logistics.filter(function(o){return o.type === 'A2P'});
    this.abattoirService.getUniqueId('dispatch')
    .then((results: any) => {
      this.abattoirDispatch.consignmentNumber = results;
    });
    this.abattoirService.getAllProcessorPOs('details')
    .then((results: any) => {
      this.allProcessorPOs = results.processorPOs;
    });
  }

  ngOnInit() {
  }

  getProductDetails(){
    if(!this.abattoirReceivedList){
      return;
    }
    this.abattoirReceivedList.forEach(element => {
      if(this.abattoirDispatch.receiptBatchId == element.receiptBatchId){
        this.abattoirReceived = element;
        //this.abattoirDispatch.purchaseOrderReferenceNumber = "POBF001";//element.purchaseOrderReferenceNumber;
        this.abattoirDispatch.livestockBatchId = element.livestockBatchId;
      }
    });

  }

  setGuid() {
    this.commonData.abattoirsProducts.forEach(element => {
      if(element.code == this.abattoirDispatch.guidNumber){
        this.abattoirDispatch.materialName = element.name;
      }
    });
  }

  saveAbattoirDispatch(myForm: NgForm){
    this.abattoirDispatch.abattoirId = this.currentUser.id;
    this.abattoirDispatch.updatedBy = this.currentUser.id;
    this.abattoirDispatch.updatedOn = new Date();
    this.abattoirDispatch.dispatchDate.setHours(this.dispatchDateTime.hour);
    this.abattoirDispatch.dispatchDate.setMinutes(this.dispatchDateTime.minute);
    this.abattoirDispatch.productionDate.setHours(this.productionDateTime.hour);
    this.abattoirDispatch.productionDate.setMinutes(this.productionDateTime.minute);
    this.abattoirService.saveAbattoirDispatch(this.abattoirDispatch)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Dispatch saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.abattoirDispatch = new AbattoirModels.AbattoirDispatch();    
  }

  setDefaultValues(){
    var poFound = false;
    this.allProcessorPOs.forEach(element => {
      if(element.salesOrder === this.abattoirDispatch.salesOrder){
        poFound = true;
        this.abattoirDispatch.purchaseOrderReferenceNumber = element.purchaseOrderReferenceNumber;
        this.abattoirDispatch.processorId = element.processorId;
      }
    });
    if(!poFound){
      this.alertService.error("Purchase order not found against this Sales Order-"+ this.abattoirDispatch.salesOrder +", Please use Sales Order starting from SOBF001.");
      this.abattoirDispatch.salesOrder = "";
      return false;
    }

    this.abattoirDispatch.logistic.id = this.userData.users.logistics[0].id;
    if(this.abattoirReceivedList && this.abattoirReceivedList.length > 0){
      this.abattoirDispatch.receiptBatchId = this.abattoirReceivedList[this.abattoirReceivedList.length-1].receiptBatchId;
    }
    this.abattoirDispatch.guidNumber = this.commonData.abattoirsProducts[0].code;
    this.abattoirDispatch.materialGrade = this.commonData.abattoirItemClasses[0];
    this.abattoirDispatch.fatCoverClass = this.commonData.fatCoverClasses[0];
    this.abattoirDispatch.quantityUnit = this.commonData.abattoirDispatchUnits[0];
    this.abattoirDispatch.quantity = 10;
    this.abattoirDispatch.temperatureStorageMin = "-20";
    this.abattoirDispatch.temperatureStorageMax = "-18";
    this.abattoirDispatch.productionDate = new Date();
    this.setGuid();
    this.getProductDetails();
    this.dispatchDateTime = {hour: 10, minute: 15};
    this.productionDateTime = {hour: 8, minute: 15};
  }
}
