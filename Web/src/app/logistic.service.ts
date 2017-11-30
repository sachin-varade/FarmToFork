import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as LogisticModels from './models/logistic';
import * as Constants from './constants';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable()
export class LogisticService {
  currentUser: any;
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http,
    private userService: UserService,
    private alertService: AlertService) {
  }

  saveLogisticTransaction(logisticTransaction: LogisticModels.LogisticTransaction): Promise<any> {
    this.url = this.BASE_URL +"/"+ this.userService.getUserLoggedIn().type +"/saveLogisticTransaction";
    return this.http.post(this.url, logisticTransaction).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
  
  updateLogisticTransactionStatus(logisticTransaction: LogisticModels.LogisticTransaction): Promise<any> {
    this.url = this.BASE_URL +"/"+ this.userService.getUserLoggedIn().type +"/updateLogisticTransactionStatus";
    return this.http.post(this.url, logisticTransaction).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  pushIotDetailsToLogisticTransaction(iotData: any): Promise<any> {
    this.url = this.BASE_URL +"/"+ this.userService.getUserLoggedIn().type +"/pushIotDetailsToLogisticTransaction";
    return this.http.post(this.url, iotData).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
  
  getAllLogisticTransactions(option: string, value: string = ""): Promise<any> {
    this.url = this.BASE_URL +"/"+ this.userService.getUserLoggedIn().type +"/getAllLogisticTransactions";
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
}
