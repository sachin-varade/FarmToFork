import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as AbattoirModels from './models/abattoir';
import * as Constants from './constants';
import { AlertService } from './alert.service';

@Injectable()
export class AbattoirService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http,
  private alertService: AlertService) { }

  saveAbattoirReceived(abattoirReceived: AbattoirModels.AbattoirReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirReceived`;
    return this.http.post(this.url, abattoirReceived).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveAbattoirDispatch(abattoirDispatch: AbattoirModels.AbattoirDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirDispatch`;
    return this.http.post(this.url, abattoirDispatch).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);      
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllAbattoirReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllAbattoirDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
}
