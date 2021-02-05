import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../model/dung/post';
import {User} from '../model/dung/user';
import {Comment} from '../model/dung/comment';

@Injectable({
  providedIn: 'root'
})
export class PersonalPageService {

  url = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  createPost(post: Post,username: string) {
    return this.http.post(`${this.url}/${username}/create/post`,post);
  }

  createComment(comment: Comment,username: string){
    return this.http.post(`${this.url}/${username}/create/comment`,comment)
  }

  getListPost(username:string){
    return this.http.get<Post[]>(`${this.url}/${username}/posts`);
  }

  getUser(username:string){
    return this.http.get<User>(`${this.url}/${username}`);
  }

  deletePost(username: string,postid: number){
    return this.http.delete<boolean>(`${this.url}/${username}/delete/post/${postid}`)
  }

  updatePost(username: any,post : Post){
    return this.http.put<Post>(`${this.url}/${username}/update/post`,post)
  }

  deleteComment(username: any,comment_id: any){
    return this.http.delete<boolean>(`${this.url}/${username}/delete/comment/${comment_id}`)
  }

  updateComment(username: any,comment: Comment){
    return this.http.put<Comment>(`${this.url}/${username}/update/comment`,comment)
  }
}
