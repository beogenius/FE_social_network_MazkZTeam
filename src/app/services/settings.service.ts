import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../model/dung/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  url = "http://localhost:8080/setting";
  constructor(private http: HttpClient) {}

  getUser(username:string){
    return this.http.get<User>(`${this.url}/${username}`);
  }

  updateInfo(user: User){
    return this.http.put<User>(`${this.url}/update`,user);
  }
}
