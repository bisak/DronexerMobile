import { Component, Input, OnInit } from '@angular/core';
import { FilesProvider } from '../../providers/files/files';
import { ToastController } from 'ionic-angular';
import { StaticDataProvider } from '../../providers/static-data/static-data';
import { PostsProvider } from '../../providers/posts/posts';
import { ValidateProvider } from '../../providers/validate/validate';

@Component({
  selector: 'upload-image-item',
  templateUrl: 'upload-image-item.html'
})
export class UploadImageItemComponent implements OnInit {

  @Input() imageUri: string = '';
  base64Img = '';
  droneSelected = '';
  caption = '';
  tags = '';

  isLoadingPreview = true;
  isSendingToServer = false;

  constructor(public filesProvider: FilesProvider,
              public toastCtrl: ToastController,
              public staticDataProvider: StaticDataProvider,
              public postsProvider: PostsProvider,
              public validateProvider: ValidateProvider) {
  }

  async ngOnInit() {
    try {
      this.base64Img = await this.filesProvider.readAsDataURL(this.imageUri);
      this.isLoadingPreview = false;
    } catch (error) {
      this.toastCtrl.create({ message: 'Couldn\'t visualise image :/' }).present();
    }
  }

  async onUploadFormSubmit(uploadCard) {
    let additionalDataObj = {
      caption: this.caption,
      tags: this.validateProvider.getTagsArray(this.tags),
      droneTaken: this.droneSelected
    };
    this.isSendingToServer = true;
    await this.postsProvider.uploadPicture(this.imageUri, additionalDataObj);
    this.isSendingToServer = false;
    uploadCard.remove();
  }

}
