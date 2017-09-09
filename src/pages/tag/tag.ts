import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Refresher, ToastController } from 'ionic-angular';
import { PostsProvider } from '../../providers/posts/posts';

@IonicPage()
@Component({
  selector: 'page-tag',
  templateUrl: 'tag.html'
})
export class TagPage {

  tag: string;
  tagPosts: Array<any> = [];
  isInfiniteScrollEnabled = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public postsProvider: PostsProvider,
              public toastCtrl: ToastController) {
    this.tag = this.navParams.get('tag');
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.getInitialPosts();

  }

  getPosts(infiniteScroll) {
    let lastPostTime = new Date(this.tagPosts[this.tagPosts.length - 1].createdAt).getTime();
    this.postsProvider.getTagPosts(this.tag, lastPostTime).subscribe((retrievedPictures) => {
      this.tagPosts.push(...retrievedPictures.data);
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
    this.postsProvider.getTagPosts(this.tag, time).subscribe((retrievedPictures) => {
      if (refresher) {
        refresher.complete();
      }
      this.tagPosts = retrievedPictures.data;
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
