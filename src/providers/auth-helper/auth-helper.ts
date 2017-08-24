import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { Events } from 'ionic-angular';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthHelperProvider {
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public events: Events,
              public storage: Storage) {
  }

  loginUser(token) {
    return this.storage.set('token', token).then(() => {
      this.events.publish('user:login');
    });
  }

  getToken() {
    return this.storage.get('token');
  }

  async getDecodedAuthToken() {
    let token = await this.getToken();
    if (!token) {
      return {};
    }
    return this.jwtHelper.decodeToken(token)._doc || {};
  }

  async isLoggedIn() {
    let token = await this.getToken();
    if (!token) {
      return false;
    }
    return this.jwtHelper.isTokenExpired(token) === false;
  }

  logout() {
    return this.storage.remove('token').then(() => {
      this.events.publish('user:logout');
    });
  }

}
