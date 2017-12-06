import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as IkeaModels from './models/ikea';
import * as Constants from './constants';
import { AlertService } from './alert.service';

@Injectable()
export class IkeaService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http,
    private alertService: AlertService) { }

  saveIkeaReceived(ikeaReceived: IkeaModels.IkeaReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveIkeaReceived`;
    return this.http.post(this.url, ikeaReceived).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveIkeaDispatch(ikeaDispatch: IkeaModels.IkeaDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveIkeaDispatch`;
    return this.http.post(this.url, ikeaDispatch).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveIkeaBill(ikeaBill: IkeaModels.IkeaBill): Promise<any> {
    this.url = `${this.BASE_URL}/saveIkeaBill`;
    return this.http.post(this.url, ikeaBill).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
  
  getUniqueId(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/ikea/getUniqueId`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results._body;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllIkeaReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllIkeaReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllIkeaDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllIkeaDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  } 
  
  getProductTrackingDetails(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getProductTrackingDetails`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("No bill found for bill number: "+ value);
    });
  } 

  getIkeaProductTrackingDetails(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getIkeaProductTrackingDetails`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("No bill found for bill number: "+ value);
    });
  } 
  
  getIkeaBill(billNumber: string): Promise<any> {
    this.url = `${this.BASE_URL}/getIkeaBill`;
    return this.http.get(this.url+"/"+ billNumber).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  } 
}


