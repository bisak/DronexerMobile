import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Refresher, ToastController } from 'ionic-angular';
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
  subscriptions = []; // TODO sometime should implement this across the mobile app...

  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public navParams: NavParams,
              public postsProvider: PostsProvider,
              public toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
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
      this.isInfiniteScrollEnabled = false;
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
    });
  }

  getInitialPosts(refresher?: Refresher) {
    this.isInfiniteScrollEnabled = true;
    let time = new Date().getTime();
    this.postsProvider.getExplorePosts(time).subscribe((retrievedPictures) => {
      if (refresher) {
        refresher.complete();
      }
      this.explorePosts = retrievedPictures.data;
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
