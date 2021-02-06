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
  getSenderFriendList():Observable<any>{
    return this.http.get(this.baseUrl + '/sendedrequest')
  }
  getUser():Observable<any>{
    return this.http.get(this.baseUrl + '/getuser')
  }
  getFriendNotRequest():Observable<any>{
    return this.http.get(this.baseUrl + '/friendnotrequest')
  }
  getFriendList():Observable<any>{
    return this.http.get('http://localhost:8080/friendlist/hai')
  }
  getReceiverList():Observable<any>{
    return this.http.get('http://localhost:8080/friendlist/hai/friendreceiver')
  }
  deleteFriend( idReceiver: any, idSender: any):Observable<any>{
    console.log("weqweqweq")
    return this.http.delete(this.baseUrl + '/delete?senderId='+idSender + '&receiverId=' + idReceiver)
  }
  acceptFriend(idReceiver: any,idSender: any):Observable<any>{
    return this.http.get(this.baseUrl + '/accept?senderId='+idSender+'&receiverId='+idReceiver)
  }
  cancelFriendRequest(idReceiver: any,idSender: any):Observable<any>{
    return this.http.get(this.baseUrl + '/cancel?senderId='+idSender+'&receiverId='+idReceiver)
  }
  addFriend(idSender: any,idReceiver: any):Observable<any>{
    console.log(idSender);
    console.log(idReceiver);
    return this.http.get(this.baseUrl + '/addfriend?senderId='+idSender+'&receiverId='+idReceiver)
  }
}
