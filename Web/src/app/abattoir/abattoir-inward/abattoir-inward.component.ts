import { Component, OnInit, ViewEncapsulation, ElementRef, Input, ViewChild, Inject } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';
import { AlertService } from '../../alert.service';
import { DOCUMENT } from '@angular/platform-browser';

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
  receiptOnTime: any;
  constructor(private user: UserService,
              private abattoirService: AbattoirService,
              private alertService: AlertService,
              @Inject(DOCUMENT) private document) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();
    this.certificates = JSON.parse(JSON.stringify(this.commonData.farmersCertificates));
    this.certificates.forEach(element => {
      element.checked = false;
    });    
    
    this.abattoirService.getUniqueId('received')
    .then((results: any) => {
      this.abattoirReceived.receiptBatchId = results;
    });
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
    var formData = new FormData();
    let file: File;
    this.abattoirReceived.updatedBy = this.currentUser.id;
    this.abattoirReceived.updatedOn = new Date();
    this.abattoirReceived.certificates = new Array<AbattoirModels.FarmersCertificate>();
    var certificateError = "";
    this.abattoirReceived.receiptOn.setHours(this.receiptOnTime.hour);
    this.abattoirReceived.receiptOn.setMinutes(this.receiptOnTime.minute);
    this.certificates.forEach(element => {
      if (element.checked === true && this.document.getElementById('file_'+ element.name).files.length > 0){
        let fileList: FileList = this.document.getElementById('file_'+ element.name).files;
        this.abattoirReceived.certificates.push(element);
        file = fileList[0];        
        formData.append(element.name, file);
        //console.log(formData.get(element.name));            
      }
      else if (element.checked === true){
        if(certificateError === ''){
          certificateError = "Please select certificate for "+ element.name;
        }
        else{
          certificateError += ", "+ element.name;        
        }        
      }
    }); 
    if(certificateError.length > 0){
      this.alertService.error(certificateError);        
      return false;
    } 
    this.abattoirReceived.abattoirId = this.currentUser.id;
    if (formData && file && file.name){ 
      this.abattoirService.uploadCertificate(formData)
      .then((results: any) => {
          this.abattoirReceived.certificates = results;
          this.save(myForm);
      });
    }
    else{
      this.save(myForm);
    }
  }
  
  save(myForm){
    this.abattoirService.saveAbattoirReceived(this.abattoirReceived)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Receipt saved.");
        window.scrollTo(0, 0);
      }
      else{
        this.alertService.error("Error occured...");
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
    this.receiptOnTime = {hour: 10, minute: 15};
  }

  onChange(event: any) {
    
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];        
        var formData = new FormData();
        formData.append("userfile", event.target.files[0]);
        console.log(formData.get("userfile"));
        this.abattoirService.uploadCertificate(formData);
    }
  }

}
