import { Component, ViewChild } from '@angular/core';
import {
  Content, IonicPage, Keyboard, NavController, NavParams, ToastController,
  ViewController
} from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { Subscription } from 'rxjs/Subscription';
import { UsersProvider } from '../../providers/users/users';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';

@IonicPage()
@Component({
  selector: 'page-post-comments',
  templateUrl: 'post-comments.html'
})
export class PostCommentsPage {

  post;
  comments = [];
  subscriptions: Subscription[] = [];
  newComment = '';
  isLoggedIn = false;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public postProvider: PostProvider,
              public usersProvider: UsersProvider,
              public authHelperProvider: AuthHelperProvider,
              public toastCtrl: ToastController,
              public keyboard: Keyboard) {
    this.post = this.navParams.get('post');
    this.authHelperProvider.isLoggedIn().then((isLogged) => {
      this.isLoggedIn = isLogged;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  openProfilePage(comment) {
    this.navCtrl.push('ProfilePage', { username: comment.user.username });
  }

  ionViewDidLoad() {
    this.loadComments();
  }

  ionViewDidLeave() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  loadComments() {
    this.subscriptions.push(this.postProvider.getComments(this.post._id).subscribe((response) => {
      this.comments = response.data;
      this.comments.map((comment) => {
        comment.profilePicUrl = this.usersProvider.getProfilePicUrl(comment.user._id);
      });
      this.goToBottom();
    }, (error) => {
      console.log(error);
    }));
  }

  onCommentFormSubmit() {
    const comment = this.newComment;
    const postId = this.post._id;
    if (!this.checkLogin() || !comment.length) {
      this.newComment = '';
      return null;
    }
    this.keyboard.close();
    this.subscriptions.push(this.postProvider.commentPost(postId, { comment }).subscribe((data) => {
      this.authHelperProvider.getDecodedAuthToken().then((user) => {
        const commentToAdd = {
          user: user,
          comment: comment,
          profilePicUrl: this.usersProvider.getProfilePicUrl(user._id)
        };
        this.comments.push(commentToAdd);
        this.goToBottom();
        this.post.commentsCount += 1;
      });
    }, (error) => {
      console.log(error);
      if (error.status === 401) {
        return this.toastCtrl.create({ message: 'Please log in to comment.', duration: 2000 }).present();
      }
    }));
    this.newComment = '';
  }

  goToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 200);
  }

  checkLogin() {
    if (!this.isLoggedIn) {
      this.toastCtrl.create({ message: 'Please log in to comment.', duration: 2000 }).present();
    }
    return this.isLoggedIn;
  }
}
