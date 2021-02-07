import { Component, OnInit } from '@angular/core';
import {User} from "../../../../model/User";
import {UserService} from "../../../../service/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: any = {};
  user!: User;
  isCreateFailed = false;
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  saveUser(): void {
    // @ts-ignore
    // console.log(this.form);
    this.user = new User()
    this.user.username = this.form.username;
    this.user.password = this.form.password;
    this.user.firstName = this.form.firstName;
    this.user.lastName = this.form.lastName;
    this.user.avatar = this.form.avatar;
    this.user.email = this.form.email;
    this.user.address = this.form.address;
    this.user.phone = this.form.phone;
    this.user.gender = this.form.gender;
    this.user.dateOfBirth = this.form.dateOfBirth;
    this.user.detail = this.form.detail;
    // let role = {
    //   name: this.form.roles
    // }
    // @ts-ignore
    this.user.roles[0].name = this.form.roles;
    console.log(this.user);
    this.userService.createUser(this.user).subscribe(data => {
        this.router.navigateByUrl('/admin/user');
        this.isCreateFailed = false;
      },
      error => {
        this.isCreateFailed = true;
        console.log(error);
      });
  }

}
