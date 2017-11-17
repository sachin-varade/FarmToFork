import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as AbattoirModels from './models/abattoir';
import * as Constants from './constants';

@Injectable()
export class AbattoirService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http) { }

  saveAbattoirReceived(abattoirReceived: AbattoirModels.AbattoirReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirReceived`;
    return this.http.post(this.url, abattoirReceived).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  saveAbattoirDispatch(abattoirDispatch: AbattoirModels.AbattoirDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirDispatch`;
    return this.http.post(this.url, abattoirDispatch).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  saveLogisticTransaction(logisticTransaction: AbattoirModels.LogisticTransaction): Promise<any> {
    this.url = `${this.BASE_URL}/saveLogisticTransaction`;
    return this.http.post(this.url, logisticTransaction).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }
  
  updateLogisticTransactionStatus(logisticTransaction: AbattoirModels.LogisticTransaction): Promise<any> {
    this.url = `${this.BASE_URL}/updateLogisticTransactionStatus`;
    return this.http.post(this.url, logisticTransaction).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }
  
  getAllAbattoirReceived(option: string): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirReceived`;
    return this.http.get(this.url+"/"+ option).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllAbattoirDispatch(option: string): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirDispatch`;
    return this.http.get(this.url+"/"+ option).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllLogisticTransactions(option: string): Promise<any> {
    this.url = `${this.BASE_URL}/getAllLogisticTransactions`;
    return this.http.get(this.url+"/"+ option).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }
}
