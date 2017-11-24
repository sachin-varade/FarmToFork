import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../user.service';
import { LogisticService } from '../../logistic.service';
import * as LogisticModels from '../../models/logistic';

@Component({
  selector: 'app-logistic-dashboard',
  templateUrl: './logistic-dashboard.component.html',
  styleUrls: ['./logistic-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LogisticDashboardComponent implements OnInit {
  currentUser: any;
  commonData: any;
  userData: any;
  logisticTransactionList: Array<LogisticModels.LogisticTransaction> = new Array<LogisticModels.LogisticTransaction>();
  constructor(private user: UserService,
    private logisticService: LogisticService) {
    this.currentUser = this.user.getUserLoggedIn();
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.logisticService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<LogisticModels.LogisticTransaction>>results.logisticTransactions;
    });    
  }
  
  ngOnInit() {
  }

}
