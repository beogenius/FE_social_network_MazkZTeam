import { Component, OnInit } from '@angular/core';
import {Friend} from "../model/friend";
import {FriendShipService} from "../services/friendshipservice";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  username: any;
  friends: Friend[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router, private friendShipService: FriendShipService) { }

  ngOnInit(): void {
    this.reloaddata();
  }

  async reloaddata() {
    this.username = sessionStorage.getItem('AuthUsername');
    let friendResponse = await this.getFriendList(this.username);
    this.friends = friendResponse.data;
  };


  goToPersonal(username: any) {
    this.router.navigate(['index/personal',username])
  }

  getFriendList(username: any) {
    return this.friendShipService.getFriendList(username).toPromise();
  };
}
