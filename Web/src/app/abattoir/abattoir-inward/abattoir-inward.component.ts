import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

@Component({
  selector: 'app-abattoir-inward',
  templateUrl: './abattoir-inward.component.html',
  styleUrls: ['./abattoir-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirInwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  selectFarmer: any;
  certificates: any;
  abattoirReceived: AbattoirModels.AbattoirReceived = new AbattoirModels.AbattoirReceived();
  constructor(private user: UserService,
              private abattoirService: AbattoirService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.certificates = JSON.parse(JSON.stringify(this.commonData.farmersCertificates));
    this.certificates.forEach(element => {
      element.checked = false;
    });    
    this.setDefaultValues();
  }

  ngOnInit() {
  }
  setFarmer() {
    const comp = this;
    // this.certificates = this.userData.users.farmers.filter(function(f){return f.name === comp.abattoirReceived.farmer; })[0].certificates;
    var farmer = this.userData.users.farmers.filter(function(f){return f.id.toString() === comp.abattoirReceived.farmer.id; })[0];
    this.abattoirReceived.farmer = farmer;
  }
  setGuid() {
    this.commonData.farmersProducts.forEach(element => {
      if(element.code == this.abattoirReceived.guidNumber){
        this.abattoirReceived.materialName = element.name;
      }
    });
  }
  saveAbattoirReceived(myForm: NgForm) {
    this.abattoirReceived.updatedBy = this.currentUser.id;
    this.abattoirReceived.updatedOn = new Date();
    this.abattoirReceived.certificates = new Array<AbattoirModels.FarmersCertificate>();
    this.certificates.forEach(element => {
      if (element.checked === true){
        this.abattoirReceived.certificates.push(element)
      }
    });
    this.abattoirReceived.abattoirId = this.currentUser.id;
    this.abattoirService.saveAbattoirReceived(this.abattoirReceived)
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
    this.abattoirReceived = new AbattoirModels.AbattoirReceived();
    this.certificates.forEach(element => {
      element.checked = false;
    });
  }

  setDefaultValues(){
    this.abattoirReceived.receiptOn = new Date();
    this.abattoirReceived.farmer = this.userData.users.farmers[0];
    this.abattoirReceived.guidNumber = this.commonData.farmersProducts[0].code;
    this.abattoirReceived.materialGrade = this.commonData.materialGrades[0];
    this.abattoirReceived.quantityUnit = this.commonData.units[0];
    this.abattoirReceived.quantity = 10;
  }
}
