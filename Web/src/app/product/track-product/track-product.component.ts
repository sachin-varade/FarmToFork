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
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
  }

  ngOnInit() {
  }

  getProductTrackingDetails(){
    this.ikeaService.getProductTrackingDetails('id', 'IDN001')
    .then((results: any) => {
      this.productTracking = results;
    });
  }

}