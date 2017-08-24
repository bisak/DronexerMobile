import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';

@Injectable()
export class UsersProvider {

  constructor(public apiProvider: ApiProvider) {
  }

  getProfilePicUrl (username: string): string {
    return `${this.apiProvider.url}/users/profile-picture/${username}`;
  }
}
