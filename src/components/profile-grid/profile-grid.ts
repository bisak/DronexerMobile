import { Component, Input } from '@angular/core';
import { PostProvider } from '../../providers/post/post';
import { ImageViewerController } from 'ionic-img-viewer';


@Component({
  selector: 'profile-grid',
  templateUrl: 'profile-grid.html'
})
export class ProfileGridComponent {

  @Input() posts;

  constructor(public postProvider: PostProvider,
              public imageViewCtrl: ImageViewerController) {
  }

  openImageViewer(image, post) {
    this.imageViewCtrl.create(image, { fullResImage: this.postProvider.getPictureUrlForPost(post) }).present();
  }

}
