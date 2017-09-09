import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, LoadingController, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';
import { ProfileProvider } from '../../providers/profile/profile';
import 'rxjs/add/operator/finally';
import { UsersProvider } from '../../providers/users/users';
import { StaticDataProvider } from '../../providers/static-data/static-data';
import { ValidateProvider } from '../../providers/validate/validate';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  isLoading = false;
  profileData;
  dronesArray = this.staticDataProvider.getDronesArray();
  profilePictureEncoded = '';
  profilePictureFile: File;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public authHelperProvider: AuthHelperProvider,
              public profileProvider: ProfileProvider,
              public usersProvider: UsersProvider,
              public staticDataProvider: StaticDataProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public validateProvider: ValidateProvider,
              public loadingCtrl: LoadingController,
              public events: Events) {
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.getProfileData();
  }

  async getProfileData() {
    let { username } = await this.authHelperProvider.getDecodedAuthToken();
    this.isLoading = true;
    let loading = this.loadingCtrl.create({ content: 'Loading...' });
    loading.present();
    this.profileProvider.getProfile(username)
      .finally(() => {
        this.isLoading = false;
        loading.dismiss();
      })
      .subscribe((response) => {
        this.profileData = response.data;
        let oldDronesArray = [];
        this.profileData['drones'].forEach((drone, index) => {
          oldDronesArray.push(this.dronesArray.indexOf(drone));
        });
        this.profileData['drones'] = oldDronesArray;
        this.profileData['profilePicUrl'] = this.usersProvider.getProfilePicUrl(this.profileData['_id']);
        console.log(JSON.stringify(this.profileData));
      }, (error) => {
        this.toastCtrl.create({ message: `Couldn't get fresh profile data :/`, duration: 2000 }).present();
      });
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

  openConfirmation() {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Please enter your current password',
      inputs: [
        {
          name: 'passwordOldConfirm',
          placeholder: 'Current password',
          type: 'password',
          checked: true
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Edit',
          handler: (data) => {
            if (data.passwordOldConfirm && data.passwordOldConfirm.length) {
              this.handleProfileEdit(data.passwordOldConfirm);
            } else {
              this.toastCtrl.create({ message: 'Please provide a confirm password!', duration: 150000 }).present();
            }
          }
        }
      ]
    });
    alert.present();
  }

  handleProfileEdit(oldPassword) {
    const editInputValidator = this.validateProvider.validateRegisterInput(this.profileData, true);
    if (!editInputValidator.isValid) {
      return this.toastCtrl.create({ message: editInputValidator.msg, duration: 1500 }).present();
    }
    const editFormData: FormData = new FormData();
    const objToSend = {
      firstName: this.profileData.firstName,
      lastName: this.profileData.lastName,
      email: this.profileData.email,
      username: this.profileData.username,
      password: this.profileData.password,
      drones: this.profileData.drones,
      oldPassword: oldPassword,
      about: this.profileData.about
    };

    editFormData.append('data', JSON.stringify(objToSend));

    if (this.profilePictureFile) {
      editFormData.append('profilePicture', this.profilePictureFile);
    }

    this.profileProvider.editProfileInfo(editFormData).subscribe((response) => {
      if (response.success) {
        this.authHelperProvider.loginUser(response.token);
        this.events.publish('profile:change');
        this.dismiss();
      }
    }, (error) => {
      return this.toastCtrl.create({ message: error.parsedBody.msg || 'An error occurred', duration: 1500 }).present();
    });
  }

}
