import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { PostsProvider } from '../../providers/posts/posts';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {

  img = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public file: File,
              public postsProvider: PostsProvider) {
  }

  sumBtnClik() {
    this.imagePicker.getPictures({ quality: 95 }).then((fileUris) => {
      this.postsProvider.uploadPictures(fileUris)
    });
  }
}
