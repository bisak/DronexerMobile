import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';
import { File } from '@ionic-native/file';
import { PostsProvider } from '../../providers/posts/posts';
import { FilesProvider } from '../../providers/files/files';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html'
})
export class UploadPage {

  fileUrisArray = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public imagePicker: ImagePicker,
              public file: File,
              public postsProvider: PostsProvider,
              public toastCtrl: ToastController,
              public filesProvider: FilesProvider,
              public loadingCtrl: LoadingController,
              public androidPermissions: AndroidPermissions) {
  }

  ionViewWillEnter() {
    if (this.fileUrisArray.length === 0) {
      this.getPictures();
    }
  }


  async getPictures() {
    try {
      await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE);
      this.fileUrisArray.unshift(...await this.imagePicker.getPictures({ quality: 95 }));
    } catch (error) {
      this.toastCtrl.create({ message: 'An error occured :/', duration: 1000 }).present();
    }
  }
}
