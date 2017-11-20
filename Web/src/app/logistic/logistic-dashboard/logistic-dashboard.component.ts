import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../user.service';
import { AbattoirService } from '../../abattoir.service';
import * as AbattoirModels from '../../models/abattoir';

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
  logisticTransactionList: Array<AbattoirModels.LogisticTransaction> = new Array<AbattoirModels.LogisticTransaction>();
  constructor(private user: UserService,
    private abattoirService: AbattoirService) {
    this.currentUser = JSON.parse(this.user.getUserLoggedIn());
    this.userData = this.user.getUserData();
    this.commonData = this.user.getCommonData();    
    this.abattoirService.getAllLogisticTransactions('details')
    .then((results: any) => {
      this.logisticTransactionList = <Array<AbattoirModels.LogisticTransaction>>results.logisticTransactions;
    });
  }
  
  ngOnInit() {
  }

}
