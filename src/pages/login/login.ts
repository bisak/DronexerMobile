import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginData = { username: '', password: '' };
  isLogInBtnDisabled = false;

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              public authHelperProvider: AuthHelperProvider,
              public toastCtrl: ToastController) {
  }

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      let toast = this.toastCtrl.create({
        message: 'Please fill in both fields',
        duration: 3000
      });
      return toast.present();
    }
    this.isLogInBtnDisabled = true;
    this.authProvider.loginUser(this.loginData).subscribe((response) => {
      this.authHelperProvider.loginUser(response.token).then((reply) => {
        this.toastCtrl.create({
          message: 'Welcome',
          duration: 3000
        }).present();
        this.navCtrl.setRoot('TabsPage');
      });
    }, error => {
      this.isLogInBtnDisabled = false;

      let toast = this.toastCtrl.create({
        message: 'Wrong username or password',
        duration: 3000
      });
      toast.present();
    });
  }

}
