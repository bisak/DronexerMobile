import { Component, Input } from '@angular/core';
import { PostProvider } from '../../providers/post/post';
import { PhotoViewer } from '@ionic-native/photo-viewer';

@Component({
  selector: 'profile-grid',
  templateUrl: 'profile-grid.html'
})
export class ProfileGridComponent {

  @Input() posts;

  constructor(public postProvider: PostProvider,
              public photoViewer: PhotoViewer) {
  }

  openImageViewer(post) {
    this.photoViewer.show(this.postProvider.getPictureUrlForPost(post), '', { share: false });
  }

}
