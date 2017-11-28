import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as IkeaModels from './models/ikea';
import * as Constants from './constants';

@Injectable()
export class IkeaService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http) { }

  saveIkeaReceived(ikeaReceived: IkeaModels.IkeaReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveIkeaReceived`;
    return this.http.post(this.url, ikeaReceived).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  saveIkeaDispatch(ikeaDispatch: IkeaModels.IkeaDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveIkeaDispatch`;
    return this.http.post(this.url, ikeaDispatch).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllIkeaReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllIkeaReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllIkeaDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllIkeaDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  } 
  
  getProductTrackingDetails(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getProductTrackingDetails`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  } 
  
}


