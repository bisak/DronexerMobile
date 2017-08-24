import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class FilesProvider {

  constructor(public file: File) {
  }

  readAsArrayBuffer(path, fileName) {
   return this.file.readAsArrayBuffer(path, fileName);
  }
}
