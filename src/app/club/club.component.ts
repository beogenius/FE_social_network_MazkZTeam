import { Component, OnInit } from '@angular/core';
import {Club} from '../model/dung/club';
import {ActivatedRoute, Router} from '@angular/router';
import {ClubService} from '../services/club.service';
import {User} from '../model/dung/user';
import Swal from "sweetalert2";
import {PersonalPageService} from '../services/personal-page.service';

// @ts-ignore
declare var $;
// @ts-ignore
declare var SockJS;
// @ts-ignore
declare var Stomp;

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



// socket
  public clubStompClient: any;

  constructor(private router: Router,
              private sv: ClubService,
              private personalSv: PersonalPageService) {
    this.disconnectFriendSocket();
    this.initializeClubWebSocketConnection()
  }

  ngOnInit(): void {
    // @ts-ignore
    this.user.username = sessionStorage.getItem('AuthUsername');
    this.reloaddata();
  }

  async reloaddata() {
    await this.getUserWhoLogin();
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
  getUserWhoLogin(){
    this.personalSv.getUser(this.user.username!).subscribe(res =>{
      this.user = res;
    });
  }



  goToClub(clubname: string) {
    this.router.navigate(['grouppage',clubname])
  }

  // createClub(club: Club) {
  //   this.sv.createClub(club, this.user.username).subscribe(
  //     res => {
  //       this.listClubByUserCreate.unshift(res);
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Create successfully!',
  //         showConfirmButton: false,
  //         timer: 500
  //       });
  //       this.newClub.name = '';
  //       this.newClub.detail = '';
  //       this.permissionx = '1';
  //     },
  //     error => {
  //       alert('false to create');
  //     }
  //   );
  // }

  onSubmit() {
    if (this.permissionx == "1"){
      this.newClub.permission = 1;
    }else{
      this.newClub.permission = 2;
    }
    this.createClub(this.newClub);
  }

  // deleteClub(username: any,clubId: any) {
  //   Swal.fire({
  //     title: 'Are you sure to delete group ?',
  //     text: 'You won\'t be able to revert this!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.sv.deleteClub(username,clubId).subscribe(data => {
  //         this.reloaddata();
  //         Swal.fire(
  //           'Delete Group!',
  //           'Your Group has been delete.',
  //           'success'
  //         );
  //       });
  //     }
  //   });
  //   console.log(username, clubId);
  // }

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

  public initializeClubWebSocketConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    this.clubStompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.clubStompClient.connect({}, function(frame: any) {
      that.clubStompClient.subscribe("/clubsocket",(data: any) => {

        let databody = JSON.parse(data.body)
        console.log(databody.isDelete)
        if(!databody.isDelete){
          if(that.user.id == databody.club.founder_id){
            that.listClubByUserCreate.unshift(databody.club);
          }else{
            that.listClubNotJoinedYet.unshift(databody.club);
          }
        }else{
          that.removeClubFromList(databody.club.id,that.listClubByUserCreate);
          that.removeClubFromList(databody.club.id,that.listClubNotJoinedYet);
          that.removeClubFromList(databody.club.id,that.listClubRequested);
          that.removeClubFromList(databody.club.id,that.listClubJoined);
        }
      });
    });
  }

  disconnectFriendSocket() {
    if (this.clubStompClient) {
      this.clubStompClient.disconnect();
    }
    console.log("Disconnected")
  }

  createClub(club: Club) {
    this.clubStompClient.send('/app/clubsocket/'+this.user.username+'/creatgroup', {}, JSON.stringify(club));
    this.newClub.name = '';
    this.newClub.detail = '';
    this.permissionx = '1';
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
        this.clubStompClient.send('/app/clubsocket/deleteclub/'+clubId);
      }
    });

  }

  removeClubFromList(club_id: any,list: Club[]){
    let index = 99999;
    for(let i = 0;i< list.length;i++){
      if(club_id == list[i].id){
        index = i;
        break;
      }
    }
    if(index != 9999){
      list.splice(index,1);
    }
  }



}
