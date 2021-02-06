import {Component, OnInit} from '@angular/core';
import {Friend} from '../model/friend';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendShipService} from '../services/friendshipservice';
import Swal from 'sweetalert2';

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private friendShipService: FriendShipService) {
  }

  ngOnInit(): void {
    this.username = sessionStorage.getItem('AuthUsername');
    console.log(this.username);
    this.reloaddata();
  }

  async reloaddata() {
    let user = await this.getUser();
    this.user = user.data;
    let friendResponse = await this.getFriendList();
    this.friends = friendResponse.data;
    let receiverFriendRes = await this.getReceiverList();
    this.receiverFriend = receiverFriendRes.data;
    let friendNotRequest = await this.getFriendListNotRequest();
    this.friendNotRequestList = friendNotRequest.data;
    let senderList = await this.getSenderFriendList();
    this.senderFriendList = senderList.data;

    console.log(this.user);
  }

  getUser() {
    return this.friendShipService.getUser().toPromise();
  }

  getFriendList() {
    return this.friendShipService.getFriendList().toPromise();
  }

  getReceiverList() {
    return this.friendShipService.getReceiverList().toPromise();
  }

  getFriendListNotRequest() {
    return this.friendShipService.getFriendNotRequest().toPromise();
  }

  getSenderFriendList(){
    return this.friendShipService.getSenderFriendList().toPromise();
  }

  deleteFriend(userId1: any, userId2: any) {
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
        this.friendShipService.deleteFriend(userId1, userId2).subscribe(data => {
          this.reloaddata();
          Swal.fire(
            'Unfriended!',
            'Your Friend has been Unfriend.',
            'success'
          );
        });
      }
    });

  }

  acceptFriend(idSender: any, idReceiver: any) {
    this.friendShipService.acceptFriend(idSender, idReceiver).subscribe(data => {
      this.reloaddata();
    });

  }

  cancelFriendRequest(idSender: any, idReceiver: any) {
    this.friendShipService.cancelFriendRequest(idSender, idReceiver).subscribe(data => {
      this.reloaddata();
    });
  }

  addFriend(idSender: any, idReceiver: any) {
    this.friendShipService.addFriend(idSender, idReceiver).subscribe(data => {
      this.reloaddata();
      console.log(data.data);
    });
  }
}
