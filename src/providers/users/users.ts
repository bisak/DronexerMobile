import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersProvider {

  constructor(public apiProvider: ApiProvider) {
  }

  getProfilePicUrl (userId: string): string {
    return `${this.apiProvider.url}/users/profile-picture/${userId}`;
  }

  followUser (userId: string): Observable<any> {
    return this.apiProvider.post(`/users/follow/${userId}`, {})
  }

  unFollowUser (userId: string): Observable<any> {
    return this.apiProvider.post(`/users/unfollow/${userId}`, {})
  }
}
