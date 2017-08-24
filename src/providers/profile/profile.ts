import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiProvider } from '../api/api';

@Injectable()
export class ProfileProvider {
  constructor(private apiService: ApiProvider) {
  }

  getProfile (username: string): Observable<any> {
    return this.apiService.get(`/users/profile-info/${username}`);
  }

  editProfileInfo (data: any): Observable<any> {
    return this.apiService.post(`/users/edit-profile`, data);
  }

  deleteProfile (data: any): Observable<any> {
    return this.apiService.post(`/users/delete-profile`, data);
  }

  followUser (userId: string): Observable<any> {
    return this.apiService.post(`/users/follow/${userId}`, {})
  }

  unFollowUser (userId: string): Observable<any> {
    return this.apiService.post(`/users/unfollow/${userId}`, {})
  }

}
