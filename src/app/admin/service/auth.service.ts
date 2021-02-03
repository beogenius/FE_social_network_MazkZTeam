import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {TokenStorageService} from "./token/token-storage.service";
import {SignUpInfor} from "../model/sign-up-infor";
import {JwtResponse} from "../model/jwt-response";
import {LoginInfor} from "../model/login-infor";
import {JwtHelperService} from "@auth0/angular-jwt";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private signUpUrl = 'http://localhost:8080/register';
  private signInUrl = 'http://localhost:8080/login';

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(sessionStorage.getItem(TOKEN_KEY));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // tslint:disable-next-line:typedef
  signUp(signUpInfor: SignUpInfor) {
    console.log(signUpInfor);
    return this.http.post<JwtResponse>(this.signUpUrl, signUpInfor);
  }


  login(loginInfor: LoginInfor) {
    return this.http.post(this.signInUrl, loginInfor, httpOptions)
      .pipe(map(
        data => {
          // console.log(data);
          this.saveUserData(data);
          return data;
        }
      ))
  }
  saveUserData(data:any) {
    this.tokenStorage.saveToken(data.accessToken);
    this.tokenStorage.saveUsername(data.username);
    this.tokenStorage.saveAuthorities(data.roles);
    this.tokenStorage.saveTokenType(data.tokenType);
    this.currentUserSubject.next(data.accessToken);
  }
}
