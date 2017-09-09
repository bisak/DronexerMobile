import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import 'rxjs/add/operator/finally';
import { UsersProvider } from '../../providers/users/users';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  searchTerm = '';
  isLoading = false;
  results;
  isLoggedIn = false;
  @ViewChild('searchBar') searchBar;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public searchProvider: SearchProvider,
              public usersProvider: UsersProvider,
              public authHelperProvider: AuthHelperProvider,
              public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.searchProvider.getLastUsers().subscribe((data) => {
      this.results = data;
      this.results.data.map((result) => {
        return result.profilePicUrl = this.usersProvider.getProfilePicUrl(result._id);
      });
      this.results.isLastUsers = true;
    });
  }

  ionViewWillEnter() {
    this.authHelperProvider.isLoggedIn().then((isLogged) => {
      this.isLoggedIn = isLogged;
    });
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.searchBar.setFocus();
    }, 200);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onInput() {
    if (this.searchTerm && this.searchTerm.length) {
      this.isLoading = true;
      this.searchProvider.search(this.searchTerm)
        .finally(() => {
          this.isLoading = false;
        })
        .subscribe((results) => {
          this.results = results;
          if (results.users) {
            this.results.data.map((result) => {
              return result.profilePicUrl = this.usersProvider.getProfilePicUrl(result._id);
            });
          }
          console.log(JSON.stringify(this.results));
        }, (error) => {
          console.log(JSON.stringify(error));
        });
    }

  }

  followUser(userId) {
    this.usersProvider.followUser(userId).subscribe((data) => {
      this.toastCtrl.create({ message: data.msg, duration: 1500 }).present();
    }, (error) => {
      this.toastCtrl.create({ message: error.parsedBody.msg, duration: 1500 }).present();
      console.log(JSON.stringify(error));
    });
  }

  unFollowUser(userId) {
    this.usersProvider.unFollowUser(userId).subscribe((data) => {
      this.toastCtrl.create({ message: data.msg, duration: 1500 }).present();
    }, (error) => {
      this.toastCtrl.create({ message: error.parsedBody.msg, duration: 1500 }).present();
      console.log(JSON.stringify(error));
    });
  }

  openProfilePage(username) {
    console.log(username);
    this.navCtrl.push('ProfilePage', { username: username });
  }

}
