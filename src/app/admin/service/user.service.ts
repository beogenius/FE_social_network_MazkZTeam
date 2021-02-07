import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TokenStorageService} from "./token/token-storage.service";
import {Observable} from "rxjs";
import {User} from "../model/User";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/admin/user'
  constructor(
    private http: HttpClient,
    private token: TokenStorageService
  ) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`)
  }
  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)
  }
  createUser(user: User): Observable<any> {
    // const token = this.token.getToken();
    // let headers = new HttpHeaders();
    // headers = headers.set('Authorization', `Bearer ${token}`);
    // return this.http.post(`${this.baseUrl}/create`, product, {headers});
    return this.http.post(`${this.baseUrl}/create`, user);
  }
  updateUser(id: number, user: User): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, user);
  }
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text'});
  }
  removeUsers(users: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/removeList`, users);
  }
}
