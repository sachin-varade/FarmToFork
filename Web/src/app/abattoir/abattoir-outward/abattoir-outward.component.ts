import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel, NgForm } from '@angular/forms';
import * as commonData from '../../data/common.json';
import * as userData from '../../data/users.json';

@Component({
  selector: 'app-abattoir-outward',
  templateUrl: './abattoir-outward.component.html',
  styleUrls: ['./abattoir-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirOutwardComponent implements OnInit {
  commonData: any;
  userData: any;
  constructor() {
    this.commonData = commonData;
    this.userData = userData;
    //console.log(userData);
  }

  ngOnInit() {
  }

}
