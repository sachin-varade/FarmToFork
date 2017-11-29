import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { IkeaService } from '../../ikea.service';
import * as IkeaModels from '../../models/ikea';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PosComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  ikeaBill : IkeaModels.IkeaBill = new IkeaModels.IkeaBill();
  constructor(private user: UserService,
    private ikeaService: IkeaService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    
    this.ikeaBill.billNumber =  Date.parse(new Date().toString()).toString(10);
    this.ikeaBill.billDateTime = new Date();
  }

  ngOnInit() {
  }

  saveIkeaBill(myForm: NgForm){
    this.ikeaService.saveIkeaBill(this.ikeaBill)
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

  addProduct(){
    this.ikeaBill.materialName = "Meatball Plate";
    this.ikeaBill.quantity++;
    this.ikeaBill.amount = (this.ikeaBill.quantity * 4.99);
  }

  clearForm(myForm: NgForm){    
    this.ikeaBill = new IkeaModels.IkeaBill(); 
  }
}

