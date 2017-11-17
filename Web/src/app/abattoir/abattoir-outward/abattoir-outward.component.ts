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
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();

    this.abattoirService.getAllAbattoirReceived('DETAILS')
    .then((results: any) => {
      this.abattoirReceivedList = <Array<AbattoirModels.AbattoirReceived>>results.abattoirMaterialReceived;
    });
  }

  ngOnInit() {
  }

  getProductDetails(){
    this.abattoirReceivedList.forEach(element => {
      if(this.abattoirDispatch.purchaseOrderReferenceNumber == element.purchaseOrderReferenceNumber){
        this.abattoirReceived = element;
        this.abattoirDispatch.rawMaterialBatchNumber = element.rawMaterialBatchNumber;
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

  saveAbattoirDispatch(){
    this.abattoirDispatch.abattoirId = this.currentUser.id;
    this.abattoirDispatch.updatedBy = this.currentUser.id;
    this.abattoirDispatch.updatedOn = new Date();
    this.abattoirService.saveAbattoirDispatch(this.abattoirDispatch)
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
    this.abattoirDispatch = new AbattoirModels.AbattoirDispatch();    
  }
}
