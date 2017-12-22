import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { IkeaService } from '../../ikea.service';
import * as IkeaModels from '../../models/ikea';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TrackComponent implements OnInit {
  showDialog: boolean = false;
  logisticType: string = "";
  currentUser: any;
  commonData: any;
  userData: any;
  productTracking: IkeaModels.ProductTracking = new IkeaModels.ProductTracking();
  ikeaDispatchList : Array<IkeaModels.IkeaDispatch> = new Array<IkeaModels.IkeaDispatch>();
  constructor(private user: UserService,    
    private ikeaService: IkeaService) {
    this.currentUser = this.user.getUserLoggedIn();
    if(this.currentUser){
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();   
    }   
    this.ikeaService.getAllIkeaDispatch('details')
    .then((results: any) => {
      this.ikeaDispatchList = <Array<IkeaModels.IkeaDispatch>>results.ikeaDispatch;      
      //this.ikeaDispatchList = <any>["12121","1231231231"];
    }); 
  }

  ngOnInit() {
  }

  getProductTrackingDetails(ikeaDispatchNumber){
    if(ikeaDispatchNumber !== ''){
      this.ikeaService.getIkeaProductTrackingDetails('id', ikeaDispatchNumber)
      .then((results: any) => {
        if(results){
          this.productTracking = results;
        }
        else{
          this.productTracking = new IkeaModels.ProductTracking();
        }
      });
    }
  }
}
