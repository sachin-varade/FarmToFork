import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

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
  constructor(private user: UserService,
    private abattoirService: AbattoirService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();

    this.abattoirService.getAllAbattoirReceived('details')
    .then((results: any) => {
      this.abattoirReceivedList = <Array<AbattoirModels.AbattoirReceived>>results.abattoirMaterialReceived;
      this.setDefaultValues();
    });
    this.abattoirDispatch.dispatchDate = new Date();
    this.userData.users.logistics = this.userData.users.logistics.filter(function(o){return o.type === 'A2P'});
  }

  ngOnInit() {
  }

  getProductDetails(){
    this.abattoirReceivedList.forEach(element => {
      if(this.abattoirDispatch.purchaseOrderReferenceNumber == element.purchaseOrderReferenceNumber){
        this.abattoirReceived = element;
        this.abattoirDispatch.receiptBatchId = element.receiptBatchId;
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
    this.abattoirService.saveAbattoirDispatch(this.abattoirDispatch)
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
    this.abattoirDispatch = new AbattoirModels.AbattoirDispatch();    
  }

  setDefaultValues(){
    this.abattoirDispatch.logistic.id = this.userData.users.logistics[0].id;
    this.abattoirDispatch.purchaseOrderReferenceNumber = this.abattoirReceivedList[0] ? this.abattoirReceivedList[0].purchaseOrderReferenceNumber : "";
    this.abattoirDispatch.guidNumber = this.commonData.abattoirsProducts[0].code;
    this.abattoirDispatch.materialGrade = this.commonData.abattoirItemClasses[0];
    this.abattoirDispatch.fatCoverClass = this.commonData.fatCoverClasses[0];
    this.abattoirDispatch.quantityUnit = this.commonData.abattoirDispatchUnits[0];
    this.abattoirDispatch.quantity = 10;
    this.abattoirDispatch.temperatureStorageMin = "1";
    this.abattoirDispatch.temperatureStorageMax = "10";
    this.abattoirDispatch.productionDate = new Date();
    this.setGuid();
    this.getProductDetails();
  }
}
