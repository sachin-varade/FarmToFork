import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { IkeaService } from '../../ikea.service';
import * as IkeaModels from '../../models/ikea';

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
    private ikeaService: IkeaService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.ikeaService.getAllIkeaReceived('details')
    .then((results: any) => {
      this.ikeaReceivedList = <Array<IkeaModels.IkeaReceived>>results.ikeaReceived;
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
        alert("Saved successfully.....");
      }
      else{
        alert("Error Occured.....");
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
}