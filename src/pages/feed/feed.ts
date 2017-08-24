import { Component } from '@angular/core';
import { IonicPage, MenuController, NavController, NavParams, ToastController } from 'ionic-angular';
import { PostsProvider } from '../../providers/posts/posts';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html'
})
export class FeedPage {

  feedPosts: Array<any> = [];
  isInfiniteScrollEnabled = true;
  subscriptions = [];
  isLoggedIn = false;

  constructor(public navCtrl: NavController,
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
    let lastPostTime = new Date(this.feedPosts[this.feedPosts.length - 1].createdAt).getTime();
    this.postsProvider.getFeedPosts(lastPostTime).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        const picData = retrievedPictures.data;
        this.feedPosts.push(...picData);
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
  }

  getInitialPosts(refresher?) {
    this.isInfiniteScrollEnabled = true;
    let time = new Date().getTime();
    this.postsProvider.getFeedPosts(time).subscribe((retrievedPictures) => {
      if (retrievedPictures.success) {
        if (refresher) {
          refresher.complete();
        }
        this.feedPosts = retrievedPictures.data;
      } else {
        console.log(retrievedPictures);
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
  }

}
