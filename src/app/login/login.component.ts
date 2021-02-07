import { Component, OnInit } from '@angular/core';
import {AuthService} from "../admin/service/auth.service";
import {TokenStorageService} from "../admin/service/token/token-storage.service";
import {Router} from "@angular/router";
import {LoginInfor} from "../admin/model/login-infor";
import {first} from "rxjs/operators";

declare var $:any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    username: '',
    password: ''
  };
  isLoginFailed = false;
  errorMessage:any;
  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.errorMessage ='';
  }

  onSubmit() {
    this.authService.login(new LoginInfor(this.form.username, this.form.password))
      .pipe(first()).subscribe(data => {
        console.log(data);
        this.isLoginFailed = false;
        this.router.navigateByUrl("/admin");
      },
      error => {
        if (error.status == "401") {
          this.errorMessage = "Username or password is wrong";
        } else {
          this.errorMessage = error.error;
          this.openModal();
        }
        console.log(error)
        this.isLoginFailed = true;
      }
    )
  }

  openModal(): void {
    $('#blockNoti').modal('show');
  }

}
