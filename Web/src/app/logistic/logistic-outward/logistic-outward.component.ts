import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';
import { NgModel, NgForm } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

@Component({
  selector: 'app-logistic-outward',
  templateUrl: './logistic-outward.component.html',
  styleUrls: ['./logistic-outward.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticOutwardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransaction: AbattoirModels.LogisticTransaction = new AbattoirModels.LogisticTransaction();
  actualDeliveryDateTime: any;
  constructor(private route: ActivatedRoute,
              private user: UserService,
              private abattoirService: AbattoirService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllAbattoirDispatch('DETAILS')
    .then((results: any) => {
      //this.abattoirDispatchList = <Array<AbattoirModels.AbattoirDispatch>>results.abattoirMaterialDispatch;
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      //this.consignmentNumber = params['consignmentNumber'];
   });
  }
}
