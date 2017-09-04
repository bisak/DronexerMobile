import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class FilesProvider {

  constructor(public file: File) {
  }

  readAsArrayBuffer(path, fileName) {
    return this.file.readAsArrayBuffer(path, fileName);
  }

  getFileLibInstance() {
    return this.file;
  }

  getFileName(uri: string) {
    let uriArr = uri.split('/');
    return uriArr.slice(-1).join('/');
  }

  getFilePath(uri: string) {
    let uriArr = uri.split('/');
    return uriArr.slice(0, -1).join('/') + '/';
  }

  removeFile(uri: string) {
    return this.file.removeFile(this.getFilePath(uri), this.getFileName(uri));
  }

  readAsDataURL(uri: string){
    return this.file.readAsDataURL(this.getFilePath(uri), this.getFileName(uri));
  }
}
