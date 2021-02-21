import { Component, OnInit } from '@angular/core';
import {UserService} from "../../admin/service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username: any;
  user: any;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.reloaddata();
  }
  reloaddata() {
    this.username = sessionStorage.getItem('AuthUsername');
    this.getUser();
    // this.getAllFriends();
  };

  getUser() {
    if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe(data => {
        console.log(data);
        this.user = data;
      }, error => {
        console.log(error);
      });
    }
  }
  goToPersonal(username: any) {
    this.router.navigate(['index/personal',username]);
  }
  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl("/login");
  }

}
