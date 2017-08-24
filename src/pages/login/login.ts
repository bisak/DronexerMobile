import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginData = { username: '', password: '' };

  constructor(public navCtrl: NavController,
              public authProvider: AuthProvider,
              public authHelperProvider: AuthHelperProvider,
              public toastCtrl: ToastController) {
  }

  onLogin(form: NgForm) {
    if (!form.valid) {
      let toast = this.toastCtrl.create({
        message: 'Please fill in both fields',
        duration: 3000
      });
      return toast.present();
    }
    this.authProvider.loginUser(this.loginData).subscribe((response) => {
      this.authHelperProvider.loginUser(response.token).then((reply) => {
        this.toastCtrl.create({
          message: 'Welcome',
          duration: 3000
        }).present();
        this.navCtrl.setRoot('TabsPage')
      })
    }, error => {
      let toast = this.toastCtrl.create({
        message: 'Login request failed :(',
        duration: 3000
      });
      toast.present();
    });
  }

}
