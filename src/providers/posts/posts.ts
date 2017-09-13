import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AuthHelperProvider } from '../auth-helper/auth-helper';
import { ToastController } from 'ionic-angular';
import { FilesProvider } from '../files/files';

@Injectable()
export class PostsProvider {
  constructor(private apiProvider: ApiProvider,
              private transfer: FileTransfer,
              private authHelperProvider: AuthHelperProvider,
              private toastCtrl: ToastController,
              private filesProvider: FilesProvider) {
  }

  async uploadPicture(uri: string, additionalData: object) {
    let token = await this.authHelperProvider.getToken();
    let options: FileUploadOptions = {
      fileKey: 'pictureFile',
      headers: {
        Authorization: token
      },
      params: { data: JSON.stringify(additionalData) }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    try {
      await fileTransfer.upload(uri, `${this.apiProvider.url}/pictures/upload`, options);
      this.toastCtrl.create({ message: 'Uploaded successfully.', duration: 1000 }).present();
    } catch (error) {
      this.toastCtrl.create({ message: 'An error occured :/' }).present();
    } finally {
      this.cleanupCachedImages(uri);
    }
  }

  private async cleanupCachedImages(uri) {
    try {
      await this.filesProvider.removeFile(uri);
    } catch (error) {
      this.toastCtrl.create({ message: 'Your picture was uploaded successfully but couldn\'t clean up afterwards' }).present();
    }
  }

  getWallPosts(username: string, time: number): Observable<any> {
    return this.apiProvider.get(`/posts/${username}?before=${time}`);
  }

  getFeedPosts(time: number): Observable<any> {
    return this.apiProvider.get(`/posts/feed?before=${time}`);
  }

  getExplorePosts(time: number): Observable<any> {
    return this.apiProvider.get(`/posts/explore?before=${time}`);
  }

  getTagPosts(tag: string, time: number): Observable<any> {
    return this.apiProvider.get(`/posts/tag/${tag}?before=${time}`);
  }

}
