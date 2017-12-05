import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { UserService } from '../../user.service';
import { IkeaService } from '../../ikea.service';
import * as IkeaModels from '../../models/ikea';


@Component({
  selector: 'app-track-product',
  templateUrl: './track-product.component.html',
  styleUrls: ['./track-product.component.css']
})
export class TrackProductComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  productTracking: IkeaModels.ProductTracking = new IkeaModels.ProductTracking();
  constructor(private user: UserService,    
    private ikeaService: IkeaService) {
    this.currentUser = this.user.getUserLoggedIn();
    if(this.currentUser){
      this.userData = this.user.getUserData();
      this.commonData = this.user.getCommonData();   
    }   
  }

  ngOnInit() {
  }

  getProductTrackingDetails(){
    if(this.productTracking.BillNumber !== ''){
      this.ikeaService.getProductTrackingDetails('id', this.productTracking.BillNumber)
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