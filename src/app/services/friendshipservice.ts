import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class FriendShipService{
  private baseUrl = 'http://localhost:8080/friendlist/hai'
  constructor(private http: HttpClient) {
  }
  getFriendList():Observable<any>{
    return this.http.get('http://localhost:8080/friendlist/hai')
  }
  getReceiverList():Observable<any>{
    return this.http.get('http://localhost:8080/friendlist/hai/friendreceiver')
  }
  deleteFriend(idSender: any, idReceiver: any):Observable<any>{
    console.log("weqweqweq")
    return this.http.delete(this.baseUrl + '/delete?senderId='+idSender + '&receiverId=' + idReceiver)
  }
  acceptFriend(idSender: any, idReceiver: any):Observable<any>{
    return this.http.get(this.baseUrl + '/accept?senderId='+idSender+'&receiverId='+idReceiver)
  }
}
