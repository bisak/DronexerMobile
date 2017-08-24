import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise'

@Injectable()
export class AuthProvider {

  constructor(private apiProvider: ApiProvider) {
  }

  registerUser(user: FormData): Observable<any> {
    return this.apiProvider.post(`/auth/register`, user);
  }

  loginUser(user): Observable<any> {
    return this.apiProvider.post(`/auth/login`, user);
  }

}
