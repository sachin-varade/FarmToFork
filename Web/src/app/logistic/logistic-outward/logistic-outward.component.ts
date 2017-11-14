import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import * as commonData from '../../data/common.json';
import * as userData from '../../data/users.json';

@Component({
  selector: 'app-logistic-outward',
  templateUrl: './logistic-outward.component.html',
  styleUrls: ['./logistic-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticOutwardComponent implements OnInit {
  commonData: any;
  userData: any;

  constructor() { 
    this.commonData = commonData;
    this.userData = userData;   
  }

  ngOnInit() {
  }

}