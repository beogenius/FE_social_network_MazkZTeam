import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/newfeedpost";
import {Comment} from "../model/hai/Comment";
import {User} from "../model/hai/user";

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
}
