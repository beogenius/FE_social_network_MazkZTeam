import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private baseUrl = 'http://localhost:8080/message'
  constructor(
    private http: HttpClient
  ) { }

  getChatMessageByRoomId(chat_room_id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${chat_room_id}`)
  }
}
