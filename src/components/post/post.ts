import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PostsProvider } from '../../providers/posts/posts';
import { PostProvider } from '../../providers/post/post';
import { UsersProvider } from '../../providers/users/users';
import { Subscription } from 'rxjs/Subscription';
import { AuthHelperProvider } from '../../providers/auth-helper/auth-helper';
import { ModalController, NavController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
  selector: 'post',
  templateUrl: 'post.html'
})
export class PostComponent implements OnInit {
  @Input() post;
  @Input() isSingle = false;
  @ViewChild('postElement') postElement: ElementRef;
  subscriptions: Subscription[] = [];
  isLoggedIn = false;

  constructor(public postsProvider: PostsProvider,
              public postProvider: PostProvider,
              public usersProvider: UsersProvider,
              public authHelperProvider: AuthHelperProvider,
              public modalCtrl: ModalController,
              public socialSharing: SocialSharing,
              public imageViewerCtrl: ImageViewerController,
              public navCtrl: NavController) {
  }

  ngOnInit() {
    this.post.pictureUrl = this.postProvider.getPictureUrlForPost(this.post);
    this.post.profilePicUrl = this.usersProvider.getProfilePicUrl(this.post.user._id);
    //console.log(this.post);
    this.authHelperProvider.isLoggedIn().then((isLogged) => {
      this.isLoggedIn = isLogged;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  likePost() {
    const postId = this.post._id;
    this.subscriptions.push(this.postProvider.likePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = true;
      this.post.likesCount += 1;
    }, (error) => {
      console.log(error);
    }));
  }

  unLikePost() {
    const postId = this.post._id;
    this.subscriptions.push(this.postProvider.unLikePost(postId).subscribe((data) => {
      this.post.isLikedByCurrentUser = false;
      this.post.likesCount -= 1;
    }, (error) => {
      console.log(error);
    }));
  }

  shareOnFacebook() {
    this.socialSharing.shareViaFacebook(
      `${this.post.caption} | Dronexer` || `Aerial Photography by ${this.post.user.username}. Join Dronexer for more.`,
      this.post.pictureUrl,
      `https://dronexer.com/post/${this.post._id}`
    );
  }

  shareOnTwitter() {
    this.socialSharing.shareViaTwitter(
      `${this.post.caption} | Dronexer` || `Aerial Photography by ${this.post.user.username}. Join Dronexer for more.`,
      this.post.pictureUrl,
      `https://dronexer.com/post/${this.post._id}`
    );
  }

  shareOnInstagram() {
    this.socialSharing.shareViaInstagram(
      `${this.post.caption} | @dronexermedia | ${this.post.tags.map(tag => `#${tag}`)}` || `Aerial Photography by ${this.post.user.username}. Join Dronexer for more.`,
      this.post.pictureUrl
    );
  }

  shareOnOthers() {
    this.socialSharing.share(
      `Join Dronexer for more.`,
      `${this.post.caption} | Dronexer` || `Aerial Photography by ${this.post.user.username}. Join Dronexer for more.`,
      null,
      this.post.pictureUrl // <-- TODO this is untested!
    );
  }

  openCommentsModal() {
    let modal = this.modalCtrl.create('PostCommentsPage', { post: this.post });
    modal.present();
  }

  openProfilePage() {
    this.navCtrl.push('ProfilePage', { username: this.post.user.username });
  }

  openImageViewer(image) {
    this.imageViewerCtrl.create(image).present();
  }
}
