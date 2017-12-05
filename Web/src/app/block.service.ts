import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as Constants from './constants';
import { UserService } from './user.service';
import { AlertService } from './alert.service';

@Injectable()
export class BlockService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http,
    private userService: UserService,
  private alertService: AlertService) { }
  
    getRecentBlocks(blockNumber): Promise<any> {
    var role = this.userService.getUserLoggedIn().role;
    if(role == 'logistic' && this.userService.getUserLoggedIn().type == 'A2P'){
      role = 'abattoir';
    }
    else if(role == 'logistic' && this.userService.getUserLoggedIn().type == 'P2I'){
      role = 'processor';
    }
    this.url = this.BASE_URL +"/getRecentBlocks" +"/"+ role;
    return this.http.get(this.url+"/"+ blockNumber).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

}

