import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import * as AbattoirModels from './models/abattoir';
import * as ProcessorModels from './models/processor';
import * as Constants from './constants';

@Injectable()
export class ProcessorService {
  private BASE_URL = Constants.API_URL;
  private headers: Headers = new Headers({'Content-Type': 'application/json'});
  private url = '';
  constructor(private http: Http) { }

  saveProcessorReceived(processorReceived: ProcessorModels.ProcessorReceived): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessorReceived`;
    return this.http.post(this.url, processorReceived).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  saveProcessingTransaction(processingTransaction: ProcessorModels.ProcessingTransaction): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessingTransaction`;
    return this.http.post(this.url, processingTransaction).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  saveProcessorDispatch(processorDispatch: ProcessorModels.ProcessorDispatch): Promise<any> {
    this.url = `${this.BASE_URL}/saveProcessorDispatch`;
    return this.http.post(this.url, processorDispatch).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllProcessorReceived(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessorReceived`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllProcessingTransactions(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessingTransactions`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }

  getAllProcessorDispatch(option: string, value: string = ""): Promise<any> {
    this.url = `${this.BASE_URL}/getAllProcessorDispatch`;
    return this.http.get(this.url+"/"+ option +"/"+ value).toPromise()
    .then((results: any) => {
      return JSON.parse(results._body);
    }).catch((err) => {
      alert("Error Occured.....");
    });
  }  
}

