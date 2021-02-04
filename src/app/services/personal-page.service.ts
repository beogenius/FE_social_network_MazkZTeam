import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Post} from '../model/dung/post';
import {User} from '../model/dung/user';

@Injectable({
  providedIn: 'root'
})
export class PersonalPageService {

  url = "http://localhost:8080";
  constructor(private http: HttpClient) { }

  createPost(post: Post,username: string) {
    return this.http.post(`${this.url}/${username}/create`,post);
  }

  getListPost(username:string){
    return this.http.get<Post[]>(`${this.url}/${username}/posts`);
  }

  getUserOwn(username:string){
    return this.http.get<User>(`${this.url}/${username}`);
  }
}
