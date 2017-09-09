import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../api/api';

@Injectable()
export class ProfileProvider {
  constructor(private apiProvider: ApiProvider) {
  }

  getProfile (username: string): Observable<any> {
    return this.apiProvider.get(`/users/profile-info/${username}`);
  }

  editProfileInfo (data: any): Observable<any> {
    return this.apiProvider.post(`/users/edit-profile`, data);
  }

  deleteProfile (data: any): Observable<any> {
    return this.apiProvider.post(`/users/delete-profile`, data);
  }

}
