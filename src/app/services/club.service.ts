import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  url = 'http://localhost:8080/club';

  constructor(private http: HttpClient) { }
}
