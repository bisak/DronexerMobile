import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PostProvider {

  constructor(private apiProvider: ApiProvider) {
  }

  commentPost(id: string, data: any): Observable<any> {
    return this.apiProvider.post(`/posts/comment/${id}`, data);
  }

  getComments(id: string): Observable<any> {
    return this.apiProvider.get(`/posts/comments/${id}`);
  }

  likePost(id: string): Observable<any> {
    return this.apiProvider.post(`/posts/like/${id}`, {});
  }

  unLikePost(id: string): Observable<any> {
    return this.apiProvider.post(`/posts/unlike/${id}`, {});
  }

  editPost(id: string, data: any) {
    return this.apiProvider.post(`/posts/edit/${id}`, data);
  }

  deletePost(id: string): Observable<any> {
    return this.apiProvider.delete(`/posts/delete/${id}`);
  }

  getPictureUrlForPost(post: any): string {
    const { fileLocation } = post;
    return `${this.apiProvider.url}/pictures/${fileLocation}/l/${post.fileName}`;
  }

  getPictureUrlForThumbnail(post: any): string {
    const { fileLocation } = post;
    return `${this.apiProvider.url}/pictures/${fileLocation}/s/${post.fileName}`;
  }

  getPost(id: string): Observable<any> {
    return this.apiProvider.get(`/posts/post/${id}`);
  }
}
