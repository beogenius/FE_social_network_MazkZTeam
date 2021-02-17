import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {
  private baseUrl = 'http://localhost:8080/chatroom'
  constructor(
    private http: HttpClient
  ) { }

  getRoomByIds(first_user_id: number, second_user_id:any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${first_user_id}/${second_user_id}`)
  }
}
