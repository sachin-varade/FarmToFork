import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as commonData from '../../data/common.json';
import * as userData from '../../data/users.json';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-abattoir-inward',
  templateUrl: './abattoir-inward.component.html',
  styleUrls: ['./abattoir-inward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AbattoirInwardComponent implements OnInit {
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
