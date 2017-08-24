import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';
import { FilesProvider } from '../files/files';

@Injectable()
export class PostsProvider {
  constructor (private apiProvider: ApiProvider, private filesProvider: FilesProvider) {
  }

  uploadPictures(fileUris: string[]){
    for (let uri of fileUris) {
      let uriArr = uri.split('/');
      let path = uriArr.slice(0, -1).join('/') + '/';
      let fileName = uriArr.slice(-1).join('/');
      this.filesProvider.readAsArrayBuffer(path, fileName).then((redFile) => {
        let file = new File([redFile], fileName)
        const uploadFormData: FormData = new FormData();
        uploadFormData.append('pictureFile', file);

        this.uploadPicture(uploadFormData).subscribe((data) => {
          console.log(data);
        }, (err) => {
          console.log(err);
        });
      });

    }
  }

  uploadPicture (formData: FormData): Observable<any> {
    return this.apiProvider.post(`/pictures/upload`, formData);
  }

  getWallPosts (username: string, time: number): Observable<any> {
    return this.apiProvider.get(`/posts/${username}?before=${time}`);
  }

  getFeedPosts (time: number): Observable<any> {
    return this.apiProvider.get(`/posts/feed?before=${time}`);
  }

  getExplorePosts (time: number): Observable<any> {
    return this.apiProvider.get(`/posts/explore?before=${time}`);
  }

  getTagPosts (tag: string, time: number): Observable<any> {
    return this.apiProvider.get(`/posts/tag/${tag}?before=${time}`);
  }

}
