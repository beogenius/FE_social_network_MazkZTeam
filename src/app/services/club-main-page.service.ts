import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClubMainPageService {

  url = 'http://localhost:8080/clubmainpage';
  constructor(private http: HttpClient) { }


}
