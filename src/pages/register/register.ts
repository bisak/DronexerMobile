import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { StaticDataProvider } from '../../providers/static-data/static-data';
import { ValidateProvider } from '../../providers/validate/validate';
import { ImagePicker } from '@ionic-native/image-picker';
import { AuthProvider } from '../../providers/auth/auth';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  registerData = {
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirm: '',
    dronesSelected: []
  };

  dronesArray = this.staticDataProvider.getDronesArray();
  profilePictureFile;
  profilePictureEncoded;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public staticDataProvider: StaticDataProvider,
              public validateProvider: ValidateProvider,
              public toastCtrl: ToastController,
              public imagePicker: ImagePicker,
              public authProvider: AuthProvider,
              public inAppBrowser: InAppBrowser) {
  }

  onProfilePictureSelected(ev) {
    const candidateFile = ev.target.files[0];
    if (candidateFile) {
      const profilePictureValidator = this.validateProvider.validateProfilePicture(candidateFile);
      if (!profilePictureValidator.isValid) {
        return this.toastCtrl.create({
          message: profilePictureValidator.msg,
          duration: 3000
        }).present();
      }
      this.profilePictureFile = candidateFile;
      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(this.profilePictureFile);
      fileReader.onload = (e) => {
        this.profilePictureEncoded = fileReader.result;
      };
    }
  }

  onRegisterSubmit(form) {
    const registerFormData: FormData = new FormData();
    const registerInputValidator = this.validateProvider.validateRegisterInput(this.registerData);
    if (!registerInputValidator.isValid) {
      return this.toastCtrl.create({
        message: registerInputValidator.msg,
        duration: 3000
      }).present();
    }

    if (this.profilePictureFile) {
      registerFormData.append('profilePicture', this.profilePictureFile);
    }

    registerFormData.append('data', JSON.stringify(this.registerData));

    this.authProvider.registerUser(registerFormData).subscribe((data) => {
      this.toastCtrl.create({
        message: 'You may now log in',
        duration: 3000
      }).present();
      this.navCtrl.setRoot('TabsPage');
    }, (err) => {
      this.toastCtrl.create({
        message: err.parsedBody.msg || 'An error occured',
        duration: 3000
      }).present();
      console.log(err.parsedBody);
    });
  }

  /*async doPictures() {
    let hasPermission = await this.imagePicker.hasReadPermission();
    if (hasPermission === false) {
      await this.imagePicker.requestReadPermission();
    } else {
      let pics = await this.imagePicker.getPictures({});
      console.log(pics);
    }
  }*/

  openTOU() {
    this.inAppBrowser.create('https://beta.dronexer.com/terms', '', { zoom: 'no' });
  }

}
