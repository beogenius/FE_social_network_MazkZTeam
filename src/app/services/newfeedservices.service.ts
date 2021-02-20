import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/newfeedpost";
import {Comment} from "../model/hai/Comment";
import {User} from "../model/hai/user";
import {Emote} from "src/app/model/hai/emote"

@Injectable({
  providedIn: 'root'
})
export class NewfeedservicesService {
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers,
  };

  postList: Post[] = [];

  constructor(private http: HttpClient) {
  }

  url: string = 'http://localhost:8080/post/api';

  getAllPost(username:string): Observable<any> {
    return this.http.get<Post[]>(`${this.url}/${username}/posts`);
  }
  //hieu
  getAllCommonFriendPublicPost(username:string): Observable<any> {
    return this.http.get(`${this.url}/${username}/public`)
  }

  createComment(comment: Comment,username: string){
    return this.http.post(`${this.url}/${username}/create/comment`,comment)
  }

  getUser(username:string){
    return this.http.get<User>(`${this.url}/${username}`);
  }


  createPost(newPost: Post, username: string) {
    return this.http.post(`${this.url}/${username}/create`,newPost);
  }

  deletePost(username: string,postid: number){
    return this.http.delete<boolean>(`${this.url}/${username}/delete/post/${postid}`)
  }

  addLike(username: string,like: Emote ) {
    return this.http.post(`${this.url}/${username}/create/emote`,like);
  }


  disLike(post_id: any, s: string) {
    return this.http.delete<boolean>(`${this.url}/${s}/dislike/${post_id}`);
  }

  updatePost(username: any,post : Post){
    return this.http.put<Post>(`${this.url}/${username}/update/post`,post)
  }

  deleteComment(username: any,comment_id: any){
    return this.http.delete<boolean>(`${this.url}/${username}/delete/comment/${comment_id}`);
  }

  updateComment(username: any,comment: Comment){
    return this.http.put<Comment>(`${this.url}/${username}/update/comment`,comment);
  }


  disLikeComment(username: any, cm_id: any) {
    return this.http.delete<boolean>(`${this.url}/${username}/delete/emote/comment/${cm_id}`)
  }
}
