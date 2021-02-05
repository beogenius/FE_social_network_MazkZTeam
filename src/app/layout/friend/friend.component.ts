import { Component, OnInit } from '@angular/core';
import {Friend} from '../../model/friend';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendShipService} from '../../services/friendshipservice';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  user: any = {
    id: 1
}
  username?: any;
  friends: Friend[] = [];
  receiverFriend: Friend[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private friendShipService: FriendShipService) { }

  ngOnInit(): void {
    this.reloaddata();
  }

  reloaddata(){
    this.friendShipService.getFriendList().subscribe(res => this.friends = res.data);
    this.friendShipService.getReceiverList().subscribe(response => this.receiverFriend = response.data);
  }

  deleteFriend(userId1: any, userId2: any){
    console.log(userId1, userId2);
    this.friendShipService.deleteFriend(userId1,userId2).subscribe(data => {
      console.log(data)
    });
    this.friendShipService.getFriendList();
  }

  acceptFriend(idSender: any, idReceiver: any) {
    this.friendShipService.acceptFriend(idSender,idReceiver).subscribe(data =>{this.reloaddata()} )

  }
}
