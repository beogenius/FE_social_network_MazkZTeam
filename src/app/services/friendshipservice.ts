import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class FriendShipService{
  private baseUrl = 'http://localhost:8080/friendlist/'
  constructor(private http: HttpClient) {
  }
  getSenderFriendList(username: any):Observable<any>{
    return this.http.get(this.baseUrl + username + '/sendedrequest')
  }
  getUser(username: any):Observable<any>{
    return this.http.get(this.baseUrl + username + '/getuser')
  }
  getFriendNotRequest(username: any):Observable<any>{
    return this.http.get(this.baseUrl + username +  '/friendnotrequest')
  }
  getFriendList(username: any):Observable<any>{
    return this.http.get(this.baseUrl + username)
  }
  getReceiverList(username: any):Observable<any>{
    return this.http.get(this.baseUrl +username + '/friendreceiver')
  }
  deleteFriend(username: any, idReceiver: any, idSender: any):Observable<any>{
    console.log("weqweqweq")
    return this.http.delete(this.baseUrl + username +  '/delete?senderId='+idSender + '&receiverId=' + idReceiver)
  }
  acceptFriend(username: any, idReceiver: any,idSender: any):Observable<any>{
    return this.http.get(this.baseUrl + username +  '/accept?senderId='+idSender+'&receiverId='+idReceiver)
  }
  cancelFriendRequest(username: any, idReceiver: any,idSender: any):Observable<any>{
    return this.http.get(this.baseUrl + username +  '/cancel?senderId='+idSender+'&receiverId='+idReceiver)
  }
  addFriend(username: any, idSender: any,idReceiver: any):Observable<any>{
    console.log(idSender);
    console.log(idReceiver);
    return this.http.get(this.baseUrl + username +  '/addfriend?senderId='+idSender+'&receiverId='+idReceiver)
  }
}
