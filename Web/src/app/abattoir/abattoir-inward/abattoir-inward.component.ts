import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import * as commonData from '../../data/common.json';
import * as userData from '../../data/users.json';

@Component({
  selector: 'app-abattoir-inward',
  templateUrl: './abattoir-inward.component.html',
  styleUrls: ['./abattoir-inward.component.css'],
  encapsulation: ViewEncapsulation.None  
})
export class AbattoirInwardComponent implements OnInit {
  commonData: any;
  userData: any;
  selectFarmer: any;
  certificates:any;
  
  constructor() {
    this.commonData = commonData;
    this.userData = userData;    
  }

  ngOnInit() {
    
  }
  setFarmer(){      
    let comp = this;
    this.certificates = this.userData.users.farmers.filter(function(f){return f.name == comp.selectFarmer;})[0].certificates;    
  }
}
