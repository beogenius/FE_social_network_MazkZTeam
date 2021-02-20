import { Component, OnInit } from '@angular/core';
import {Club} from '../model/dung/club';
import {ActivatedRoute, Router} from '@angular/router';
import {FriendShipService} from '../services/friendshipservice';
import {ClubService} from '../services/club.service';
import {User} from '../model/dung/user';
import Swal from "sweetalert2";
import {migrateLegacyGlobalConfig} from '@angular/cli/utilities/config';

@Component({
  selector: 'app-club',
  templateUrl: './club.component.html',
  styleUrls: ['./club.component.css']
})
export class ClubComponent implements OnInit {
  listClubByUserCreate: Club[] = [];
  listClubNotJoinedYet: Club[] = [];
  listClubJoined: Club[] = [];
  listClubRequested:Club[] = [];
  permissionx='1';
  user: User = {};
  newClub: Club = {};

  constructor(private router: Router,
              private sv: ClubService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.user.username = sessionStorage.getItem('AuthUsername');
    this.reloaddata();
  }

  async reloaddata() {
    let listClubByUserCreate = await this.getListClubByUserCreate(this.user.username)
    this.listClubByUserCreate = listClubByUserCreate;
    let listClubNotJoinedYet = await this.getListClubNotJoinedYet(this.user.username);
    this.listClubNotJoinedYet = listClubNotJoinedYet;
    let listClubUserJoined = await this.getListClubsJoined(this.user.username);
    this.listClubJoined = listClubUserJoined;
    let listClubRequested = await this.getClubsRequested(this.user.username);
    this.listClubRequested = listClubRequested;
  }

  getClubsRequested(username: any){
    return this.sv.getClubsRequested(username).toPromise();
  }
  getListClubByUserCreate(username: any) {
    return this.sv.getClubListByUserCreate(username).toPromise();
  }
  getListClubNotJoinedYet(username: any){
    return this.sv.getClubNotJoinedYet(username).toPromise();
  }
  getListClubsJoined(username: any){
    return this.sv.getClubsUserJoined(username).toPromise();
  }

  goToClub(clubname: string) {
    this.router.navigate(['grouppage',clubname])
  }

  createClub(club: Club) {
    this.sv.createClub(club, this.user.username).subscribe(
      res => {
        this.listClubByUserCreate.unshift(res);
        Swal.fire({
          icon: 'success',
          title: 'Create successfully!',
          showConfirmButton: false,
          timer: 500
        });
        this.newClub.name = '';
        this.newClub.detail = '';
        this.permissionx = '1';
      },
      error => {
        alert('false to create');
      }
    );
  }

  onSubmit() {
    if (this.permissionx == "1"){
      this.newClub.permission = 1;
    }else{
      this.newClub.permission = 2;
    }
    console.log(this.newClub);
    this.createClub(this.newClub);

  }

  deleteClub(username: any,clubId: any) {
    Swal.fire({
      title: 'Are you sure to delete group ?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sv.deleteClub(username,clubId).subscribe(data => {
          this.reloaddata();
          Swal.fire(
            'Delete Group!',
            'Your Group has been delete.',
            'success'
          );
        });
      }
    });
    console.log(username, clubId);
  }

  joinClub(username: any,club: any,index: any) {
    this.sv.requesJoin(username,club.id).subscribe(res => {
      if (!res) {
        alert('False to request')
      }else {
        this.listClubNotJoinedYet.splice(index,1);
        this.listClubRequested.unshift(club);
      }
    });
  }

  leaveGroup(username: any,clubId:any) {
    Swal.fire({
      title: 'Are you sure to leave group ?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Leave'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sv.leaveClub(username,clubId).subscribe(data => {
          this.reloaddata();
          Swal.fire(
            'Leave Group!',
            'Success',
            'success'
          );
        });
      }
    });
    console.log(username, clubId);
  }

  CancelReq(username: any, club: any,index: any) {
    this.sv.cancelJoinReq(username,club.id).subscribe(data => {
      if(data){
        this.listClubRequested.splice(index,1);
        this.listClubNotJoinedYet.unshift(club);
      }
    })
  }
}
