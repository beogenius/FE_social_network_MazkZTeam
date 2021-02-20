import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {Club} from '../model/dung/club';
import {Post} from '../model/newfeedpost';
import {User} from '../model/dung/user';

@Injectable({
  providedIn: 'root'
})
export class ClubMainPageService {

  url = 'http://localhost:8080/clubmainpage/';
  constructor(private http: HttpClient) { }

  getClub(username: any,clubname: any){
    return this.http.get<Club>(this.url + username +'/'+ clubname);
  }

  getPostList(username: any,clubname: any){
    return this.http.get<Post[]>(this.url + username +'/'+ clubname +'/posts');
  }

  getMemberList(username: any,clubname: any){
    return this.http.get<User[]>(this.url + username +'/'+ clubname +'/members');
  }

  getReqJoinList(username: any,clubname: any){
    return this.http.get<User[]>(this.url + username +'/'+ clubname +'/reqjoins');
  }

  acceptJoinReq(username: any,clubname: any,reqjoin_id:any){
    return this.http.get<boolean>(this.url + username +'/'+ clubname +'/acceptjoinreq/' + reqjoin_id);
  }

  refuseJoinReq(username: any,clubname: any,reqjoin_id:any){
    return this.http.delete<boolean>(this.url + username +'/'+ clubname +'/refuse/' + reqjoin_id);
  }

  kickMenber(username: any,clubname: any,member_id:any){
    return this.http.delete<boolean>(this.url + username +'/'+ clubname +'/kick/' + member_id);
  }


}
