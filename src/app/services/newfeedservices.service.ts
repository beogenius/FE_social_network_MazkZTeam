import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../model/newfeedpost";

@Injectable({
  providedIn: 'root'
})
export class NewfeedservicesService {
  headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  httpOptions = {
    headers: this.headers,
  };

  postList: Post[] = [];

  constructor(private http: HttpClient) { }

  url: string = 'http://localhost:8080/post/api/';

  getAllPost() : Observable<any> {
    return this.http.get<Post[]>(this.url);
  }
}
