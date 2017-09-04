import { Component } from '@angular/core';
import { IonicPage, MenuController, ModalController, NavController, NavParams, Refresher, ToastController } from 'ionic-angular';
import { PostsProvider } from '../../providers/posts/posts';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html'
})
export class DiscoverPage {

  explorePosts: Array<any> = [];
  isInfiniteScrollEnabled = true;
  subscriptions = [];
  isLoggedIn = false;

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public menu: MenuController,
              public postsProvider: PostsProvider,
              public toastCtrl: ToastController,
              public authHelperProvider: AuthHelperProvider) {
    this.authHelperProvider.isLoggedIn().then((isLogged) => {
      this.isLoggedIn = isLogged;
    });
  }

  ionViewDidLoad() {
    this.getInitialPosts();
  }

  getPosts(infiniteScroll) {
    let lastPostTime = new Date(this.explorePosts[this.explorePosts.length - 1].createdAt).getTime();
    this.postsProvider.getExplorePosts(lastPostTime).subscribe((retrievedPictures) => {
      this.explorePosts.push(...retrievedPictures.data);
      infiniteScroll.complete();
    }, (error) => {
      infiniteScroll.complete();
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
      this.isInfiniteScrollEnabled = false;
    });
  }

  getInitialPosts(refresher?: Refresher) {
    this.isInfiniteScrollEnabled = true;
    let time = new Date().getTime();
    this.postsProvider.getExplorePosts(time).subscribe((retrievedPictures) => {
      if (refresher) {
        refresher.complete();
      }
      if (this.explorePosts.length >= 10) {
        this.explorePosts = this.explorePosts.splice(0, 10);
      }
      this.explorePosts.unshift(...retrievedPictures.data);
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
  }

  openSearchModal() {
    let modal = this.modalCtrl.create('SearchPage');
    modal.present();
  }

}
