import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Club} from '../model/dung/club';
@Injectable({
  providedIn: 'root'
})
export class ClubService {
  url = 'http://localhost:8080/club/';
  constructor(private http: HttpClient) { }
  getClubListByUserCreate(username: any):Observable<any>{
    return this.http.get(this.url + username + '/listclubbyusercreate');
  }
  createClub(club: Club,username: any):Observable<any>{
    return this.http.post(this.url + username + '/create',club);
  }
  getClubNotJoinedYet(username: any):Observable<any>{
    return this.http.get(this.url + username + '/getclubsnotjoinedyet');
  }
  deleteClub(username: any,clubId: any):Observable<any>{
    return this.http.delete(this.url + username +'/deleteclub/' + clubId);
  }
  getClubsUserJoined(username: any):Observable<any>{
    return this.http.get(this.url + username + '/getclubsjoined');
  }
  leaveClub(username: any,clubId: any):Observable<any>{
    return this.http.delete(this.url + username + '/leaveclub/' + clubId);
  }
  requesJoin(username: any,clubId: any):Observable<any>{
    return this.http.get(this.url + username + '/reqjoin/' + clubId);
  }
}
