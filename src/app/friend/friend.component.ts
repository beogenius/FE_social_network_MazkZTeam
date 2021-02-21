import {Component, OnInit} from '@angular/core';
import {Friend} from '../model/friend';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendShipService} from '../services/friendshipservice';
import Swal from 'sweetalert2';

// @ts-ignore
declare var $;
// @ts-ignore
declare var SockJS;
// @ts-ignore
declare var Stomp;

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  username: any;
  user: any;
  friends: Friend[] = [];
  receiverFriend: Friend[] = [];
  friendNotRequestList: Friend[] = [];
  senderFriendList: Friend[] = [];
  showMore = false;
  startPage: any;
  paginationLimit: any;
  public stompClientFriends: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private friendShipService: FriendShipService) {
    this.disconnectFriendSocket();
    this.initializeWebSocketFriendConnection();
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('AuthUsername');
    console.log(this.username);
    this.reloaddata();
  }

  async reloaddata() {
    let user = await this.getUser(this.username);
    this.user = user.data;
    let friendResponse = await this.getFriendList(this.username);
    this.friends = friendResponse.data;
    let receiverFriendRes = await this.getReceiverList(this.username);
    this.receiverFriend = receiverFriendRes.data;
    let friendNotRequest = await this.getFriendListNotRequest(this.username);
    this.friendNotRequestList = friendNotRequest.data;
    this.friendNotRequestList.shift();
    let senderList = await this.getSenderFriendList(this.username);
    this.senderFriendList = senderList.data;
    this.startPage = 0;
    this.paginationLimit=4;

    console.log(this.user);
  }

  getUser(username: any) {
    return this.friendShipService.getUser(username).toPromise();
  }

  getFriendList(username: any) {
    return this.friendShipService.getFriendList(username).toPromise();
  }

  getReceiverList(username: any) {
    return this.friendShipService.getReceiverList(username).toPromise();
  }

  getFriendListNotRequest(username: any) {
    return this.friendShipService.getFriendNotRequest(username).toPromise();
  }

  getSenderFriendList(username: any){
    return this.friendShipService.getSenderFriendList(username).toPromise();
  }

  // deleteFriend(username: any,userId1: any, userId2: any) {
  //   console.log(userId1, userId2);
  //   Swal.fire({
  //     title: 'Are you sure to Unfriend ?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.friendShipService.deleteFriend(username,userId1, userId2).subscribe(data => {
  //         this.reloaddata();
  //         Swal.fire(
  //           'Unfriended!',
  //           'Your Friend has been Unfriend.',
  //           'success'
  //         );
  //       });
  //     }
  //   });
  // }

  deleteFriend(username: any,userId1: any, userId2: any) {
    console.log(userId1, userId2);
    Swal.fire({
      title: 'Are you sure to Unfriend ?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stompClientFriends.send("/app/friends/unfriend/" + userId1 + "/" + userId2);
        Swal.fire(
            'Unfriended!',
            'Your Friend has been Unfriend.',
            'success'
          );
        };
    });

  }

  // acceptFriend(username: any, idSender: any, idReceiver: any) {
  //   this.friendShipService.acceptFriend(username,idSender, idReceiver).subscribe(data => {
  //     this.reloaddata();
  //   });
  // }
  acceptFriend(username: any, idSender: any, idReceiver: any) {
    // this.friendShipService.acceptFriend(username,idSender, idReceiver).subscribe(data => {
    //   this.reloaddata();
    // });
    this.stompClientFriends.send("/app/friends/accept/" + idReceiver + "/" + idSender);

  }

  // cancelFriendRequest(username: any, idSender: any, idReceiver: any) {
  //   this.friendShipService.cancelFriendRequest(username,idSender, idReceiver).subscribe(data => {
  //     this.reloaddata();
  //   });
  // }

  cancelFriendRequest(username: any, idSender: any, idReceiver: any) {
    // this.friendShipService.cancelFriendRequest(username,idSender, idReceiver).subscribe(data => {
    //   this.reloaddata();
    // });
    this.stompClientFriends.send("/app/friends/cancel/" + idReceiver + "/" + idSender);
  }

  // addFriend(username: any ,idSender: any, idReceiver: any) {
  //   this.friendShipService.addFriend(username,idSender, idReceiver).subscribe(data => {
  //     this.reloaddata();
  //     // console.log(data.data);
  //   });
  // }

  addFriend(username: any ,idSender: any, idReceiver: any) {
    // this.friendShipService.addFriend(username, idSender, idReceiver).subscribe(data => {
    //   this.reloaddata();
    //   // console.log(data.data);
    // });
    this.stompClientFriends.send("/app/friends/add/" + idSender + "/" + idReceiver);
  }

  public initializeWebSocketFriendConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    console.log(ws);
    this.stompClientFriends = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClientFriends.connect({}, function(frame: any) {
      console.log(frame)
      that.stompClientFriends.subscribe("/friends", (friend: any) => {
        console.log(friend);
        let data = JSON.parse(friend.body)
        console.log(data);
        that.ngOnInit();
      });
    });
  }

  disconnectFriendSocket() {
    if (this.stompClientFriends) {
      this.stompClientFriends.disconnect();
    }
    console.log("Disconnected")
  }

  goToPersonal(username: any) {
    this.router.navigate(['index/personal',username])
  }

  showMoreItems() {
    this.paginationLimit = Number(this.paginationLimit) + 3;
  }
}
