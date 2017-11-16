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
    return this.http.post(this.url, abattoirReceived).toPromise();
  }
}
