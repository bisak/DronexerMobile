import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController, Events } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';
import { PostsProvider } from '../../providers/posts/posts';
import { PostProvider } from '../../providers/post/post';
import { UsersProvider } from '../../providers/users/users';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/finally';

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
  isLoggedIn = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public profileProvider: ProfileProvider,
              public authHelperProvider: AuthHelperProvider,
              public usersProvider: UsersProvider,
              public viewCtrl: ViewController,
              public toastCtrl: ToastController,
              public postsProvider: PostsProvider,
              public postProvider: PostProvider,
              public storage: Storage,
              public modalCtrl: ModalController,
              public events: Events) {
    this.isProfileMine = this.navParams.get('isProfileMine');
    this.requestedUsername = this.navParams.get('username');
    this.setup();
  }

  async setup() {
    this.profileViewMode = await this.storage.get('profileViewMode') || 'grid';
    this.isLoggedIn = await this.authHelperProvider.isLoggedIn();
  }

  ionViewWillEnter() {
    this.getProfileInfo();
    if (!this.isProfileMine) {
      this.getInitialWallPosts();
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    if (this.isProfileMine) {
      this.getInitialWallPosts();
    }
    this.listenForProfileChange();
  }


  getProfileInfo() {
    this.authHelperProvider.getDecodedAuthToken().then((user) => {
      this.profileProvider.getProfile(this.requestedUsername || user.username).subscribe((response) => {
        this.profileData = response.data;
        this.profileData.profilePicUrl = this.usersProvider.getProfilePicUrl(response.data._id);
      }, (error) => {
      });
    });
  }

  onRefresh(refresher) {
    this.getInitialWallPosts(refresher);
    this.getProfileInfo();
  }

  getInitialWallPosts(refresher?) {
    this.isInfiniteScrollEnabled = true;
    let time = new Date().getTime();
    this.authHelperProvider.getDecodedAuthToken().then((user) => {
      this.postsProvider.getWallPosts(this.requestedUsername || user.username, time)
        .finally(() => {
          if (refresher) {
            refresher.complete();
          }
        })
        .subscribe((response) => {
          this.wallPosts = response.data;
        }, (error) => {

          if (error.status === 404) {
            return this.toastCtrl.create({
              message: 'No posts available',
              duration: 2000
            }).present();
          }
          this.toastCtrl.create({
            message: 'An error occured when getting posts',
            duration: 2000
          }).present();
        });
    });
  }

  async getPosts(infiniteScroll) {
    let lastPostTime = new Date(this.wallPosts[this.wallPosts.length - 1].createdAt).getTime();
    let user = await this.authHelperProvider.getDecodedAuthToken();
    this.postsProvider.getWallPosts(this.requestedUsername || user.username, lastPostTime)
      .finally(() => {
        infiniteScroll.complete();
      })
      .subscribe((retrievedPictures) => {
        const picData = retrievedPictures.data;
        this.wallPosts.push(...picData);
      }, (error) => {
        this.isInfiniteScrollEnabled = false;
        if (error.status === 404) {
          return this.toastCtrl.create({
            message: 'No more posts available',
            duration: 2000
          }).present();
        }
        this.toastCtrl.create({
          message: 'An error occured when getting posts',
          duration: 2000
        }).present();
      });
  }

  selectViewMode(mode: string) {
    this.storage.set('profileViewMode', mode);
    this.profileViewMode = mode;
  }

  followUser() {
    this.usersProvider.followUser(this.profileData._id).subscribe((response) => {
      this.profileData.isFollowed = true;
      this.profileData.followeesCount += 1;
    }, (error) => {
      this.toastCtrl.create({ message: 'Error following user....', duration: 1500 }).present();
    });
  }

  unFollowUser() {
    this.usersProvider.unFollowUser(this.profileData._id).subscribe((response) => {
      this.profileData.isFollowed = false;
      this.profileData.followeesCount -= 1;
    }, (error) => {
      this.toastCtrl.create({ message: 'Error following user....', duration: 1500 }).present();
    });
  }

  openSettingsModal() {
    let modal = this.modalCtrl.create('SettingsPage');
    modal.present();
  }

  listenForProfileChange() {
    this.events.subscribe('profile:change', () => {
      this.getProfileInfo();
    });
  }
}
