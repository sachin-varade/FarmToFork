import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as AbattoirModels from './models/abattoir';
import * as ProcessorModels from './models/processor';
import * as Constants from './constants';
import { AlertService } from './alert.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

@Injectable()
export class ProcessorService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: HttpClient,
    private alertService: AlertService) { }

  saveProcessorReceived(processorReceived: ProcessorModels.ProcessorReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessorReceived`;
    return this.http.post(this.url, processorReceived).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveProcessingTransaction(processingTransaction: ProcessorModels.ProcessingTransaction): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessingTransaction`;
    return this.http.post(this.url, processingTransaction).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  saveProcessorDispatch(processorDispatch: ProcessorModels.ProcessorDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessorDispatch`;
    return this.http.post(this.url, processorDispatch).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getUniqueId(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/processor/getUniqueId`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results.uniqueId;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllProcessorReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessorReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllProcessingTransactions(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessingTransactions`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  getAllProcessorDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessorDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }  

  getAllIkeaPOs(option: string = "", value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllIkeaPOs`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }

  uploadQualityControlDocument(formData: any): Promise<any> {
    let headers = new Headers();
    headers.append('Accept', 'application/json');    
    let options = new RequestOptions({ headers: headers });
    this.url = `${this.BASE_URL}/uploadQualityControlDocument`;
    return this.http.post(this.url, formData).toPromise()
    .then((results: any) => {
      return results;
    }).catch((err) => {
      this.alertService.error("Error occured...");
    });
  }
}

