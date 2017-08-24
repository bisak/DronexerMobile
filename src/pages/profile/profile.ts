import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';
import { PostsProvider } from '../../providers/posts/posts';
import { PostProvider } from '../../providers/post/post';
import { UsersProvider } from '../../providers/users/users';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  requestedUsername;
  profileData;
  isProfileMine;
  isInfiniteScrollEnabled = true;
  wallPosts = [];
  profileViewMode = 'grid';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public profileProvider: ProfileProvider,
              public authHelperProvider: AuthHelperProvider,
              public usersProvider: UsersProvider,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              public postsProvider: PostsProvider,
              public postProvider: PostProvider,
              public storage: Storage) {
    this.requestedUsername = this.navParams.get('username');
    this.isProfileMine = this.navParams.get('isProfileMine');
    this.storage.get('profileViewMode').then((profileViewMode) => {
      if (profileViewMode) {
        this.profileViewMode = profileViewMode;
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('didloadd');
    this.getProfileInfo();
    this.getInitialWallPosts();
  }


  getProfileInfo() {
    this.authHelperProvider.getDecodedAuthToken().then((user) => {
      this.profileProvider.getProfile(this.requestedUsername || user.username).subscribe((response) => {
        this.profileData = response.data;
        this.profileData.profilePicUrl = this.usersProvider.getProfilePicUrl(response.data._id);
      }, (error) => {
        console.log(error);
      });
    });
  }

  getInitialWallPosts(refresher?) {
    this.isInfiniteScrollEnabled = true;
    let time = new Date().getTime();
    this.authHelperProvider.getDecodedAuthToken().then((user) => {
      this.postsProvider.getWallPosts(this.requestedUsername || user.username, time).subscribe((response) => {
        if (response.success) {
          if (refresher) {
            refresher.complete();
          }
          this.wallPosts = response.data;
        } else {
          console.log(response);
          this.toastCtrl.create({
            message: 'An error occured when getting posts',
            duration: 3000
          }).present();
        }
      }, (error) => {
        console.log(error);
        if (error.status === 204) {
          return this.toastCtrl.create({
            message: 'No more posts available',
            duration: 3000
          }).present();
        }
        this.toastCtrl.create({
          message: 'An error occured when getting posts',
          duration: 3000
        }).present();
      });
    });
  }

  getPosts(infiniteScroll) {
    let lastPostTime = new Date(this.wallPosts[this.wallPosts.length - 1].createdAt).getTime();
    this.authHelperProvider.getDecodedAuthToken().then((user) => {
      this.postsProvider.getWallPosts(this.requestedUsername || user.username, lastPostTime).subscribe((retrievedPictures) => {
        if (retrievedPictures.success) {
          const picData = retrievedPictures.data;
          this.wallPosts.push(...picData);
          infiniteScroll.complete();
        } else {
          console.log(retrievedPictures);
          this.toastCtrl.create({
            message: 'No more posts available',
            duration: 3000
          }).present();
          infiniteScroll.complete();
          this.isInfiniteScrollEnabled = false;
        }
      }, (error) => {
        console.log(error);
        if (error.status === 404) {
          return this.toastCtrl.create({
            message: 'No more posts available',
            duration: 3000
          }).present();
        }
        this.toastCtrl.create({
          message: 'An error occured when getting posts',
          duration: 3000
        }).present();
        infiniteScroll.complete();
        this.isInfiniteScrollEnabled = false;
      });
    });
  }

  selectGridViewMode() {
    this.storage.set('profileViewMode', 'grid');
    this.profileViewMode = 'grid';
  }

  selectListViewMode() {
    this.storage.set('profileViewMode', 'list');
    this.profileViewMode = 'list';
  }
}
