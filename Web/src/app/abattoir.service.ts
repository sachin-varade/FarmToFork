import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as AbattoirModels from './models/abattoir';
import * as Constants from './constants';
import { AlertService } from './alert.service';
import { Observable } from "rxjs/Observable";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class AbattoirService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: HttpClient,
  private alertService: AlertService) { }

  saveAbattoirReceived(abattoirReceived: AbattoirModels.AbattoirReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirReceived`;
    return this.http.post(this.url, abattoirReceived).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error(err);
    });
  }

  saveAbattoirDispatch(abattoirDispatch: AbattoirModels.AbattoirDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveAbattoirDispatch`;
    return this.http.post(this.url, abattoirDispatch).toPromise()
    .then((results: any) => {
      return results;      
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getUniqueId(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/abattoir/getUniqueId`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results.uniqueId;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllAbattoirReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllAbattoirDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllAbattoirDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  uploadCertificate(formData: any): Promise<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');    
    let options = new RequestOptions({ headers: headers });
    this.url = `${this.BASE_URL}/uploadCertificate`;
    return this.http.post(this.url, formData).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
}
