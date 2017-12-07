import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { IkeaService } from '../../ikea.service';
import * as IkeaModels from '../../models/ikea';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'app-ikea-outward',
  templateUrl: './ikea-outward.component.html',
  styleUrls: ['./ikea-outward.component.css']
})
export class IkeaOutwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  ikeaReceivedList: Array<IkeaModels.IkeaReceived> = new Array<IkeaModels.IkeaReceived>();
  ikeaDispatch : IkeaModels.IkeaDispatch = new IkeaModels.IkeaDispatch();
  constructor(private user: UserService,    
    private ikeaService: IkeaService,
  private alertService: AlertService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.ikeaService.getAllIkeaReceived('details')
    .then((results: any) => {
      this.ikeaReceivedList = <Array<IkeaModels.IkeaReceived>>results.ikeaReceived;
      this.setDefaultValues();
    }); 
    this.ikeaService.getUniqueId('dispatch')
    .then((results: any) => {
      this.ikeaDispatch.ikeaDispatchNumber = results;
    });     
  }

  ngOnInit() {
  }

  setGuid() {
    this.commonData.ikeaDispatchProducts.forEach(element => {
      if(element.code == this.ikeaDispatch.guidNumber){
        this.ikeaDispatch.materialName = element.name;
      }
    });
  }
  
  saveIkeaDispatch(myForm: NgForm){
    this.ikeaDispatch.ikeaId = this.currentUser.id;
    this.ikeaService.saveIkeaDispatch(this.ikeaDispatch)
    .then((results: any) => {
      if(results[0].status.indexOf('SUCCESS') > -1){
        this.clearForm(myForm);
        this.alertService.success("Ikea dispatch saved.");
      }
      else{
        this.alertService.error("Error occured...");
      }
    });
  }

  clearForm(myForm: NgForm){
    myForm.resetForm();
    this.commonData.ikeaAcceptanceCriteria.forEach(element => {
      element.conditionSatisfied = false;      
    });
    this.ikeaDispatch = new IkeaModels.IkeaDispatch();    
  }

  setDefaultValues(){
    if(this.ikeaReceivedList && this.ikeaReceivedList.length>0){
      this.ikeaDispatch.ikeaReceivedNumber = this.ikeaReceivedList[this.ikeaReceivedList.length-1].ikeaReceivedNumber;
    }
    
    this.ikeaDispatch.guidNumber = this.commonData.ikeaDispatchProducts[0].code;
    this.setGuid();
    //this.ikeaDispatch.materialGrade = this.commonData.materialGrades[0];
    this.ikeaDispatch.preparedOn = new Date();
    this.ikeaDispatch.dispatchDateTime = new Date();
    this.ikeaDispatch.soldFromDate = new Date();
    this.ikeaDispatch.soldUntillDate = new Date();
    this.ikeaDispatch.soldUntillDate.setDate(new Date().getDate()+30);  
    this.ikeaDispatch.quantity = 10;
    this.ikeaDispatch.quantityUnit = this.commonData.processingTransactionUnits[0];
  }
}