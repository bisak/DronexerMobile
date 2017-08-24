import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/throw';
import { getEnv } from '../../environments/environments';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

@Injectable()
export class ApiProvider {
  url: string = getEnv().apiUrl;

  constructor(public http: Http,
              public storage: Storage) {
  }

  get(endpoint: string) {
    return this.getAuthToken().flatMap(token => {
      let headers;
      if (token) {
        headers = new Headers();
        headers.append('Authorization', token);
      }
      return this.http.get(this.url + endpoint, { headers: headers })
        .map((res) => this.extractData(res))
        .catch((err) => this.handleError(err));
    });
  }

  post(endpoint: string, body: any, options?: RequestOptions) {
    return this.getAuthToken().flatMap(token => {
      let headers;
      if (token) {
        headers = new Headers();
        headers.append('Authorization', token);
      }
      return this.http.post(this.url + endpoint, body, { headers: headers })
        .map((res) => this.extractData(res))
        .catch((err) => this.handleError(err));
    });
  }

  put(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + endpoint, body, options)
      .map((res) => this.extractData(res))
      .catch((err) => this.handleError(err));
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.http.delete(this.url + endpoint, options)
      .map((res) => this.extractData(res))
      .catch((err) => this.handleError(err));
  }

  patch(endpoint: string, body: any, options?: RequestOptions) {
    return this.http.put(this.url + endpoint, body, options)
      .map((res) => this.extractData(res))
      .catch((err) => this.handleError(err));
  }

  private handleError(error: Response | any) {
    console.log('API SERVICE', error);
    let errToPass = error;
    errToPass.parsedBody = error.json() || {};
    return Observable.throw(errToPass);
  }

  private extractData(res: Response) {
    return res.json() || {};
  }

  private getAuthToken() {
    return Observable.fromPromise(this.storage.get('token'));
  }

}
