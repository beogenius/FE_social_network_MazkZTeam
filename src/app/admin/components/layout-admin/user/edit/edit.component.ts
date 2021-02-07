import { Component, OnInit } from '@angular/core';
import {User} from "../../../../model/User";
import {UserService} from "../../../../service/user.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  user: any;
  id =  0;
  constructor(
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      console.log(data)
        this.id = data.id;
        // tslint:disable-next-line:no-shadowed-variable
      },
      error => {
        console.log(error);
      });

    this.userService.getUser(this.id).subscribe(data => {
      this.user = data;
      if (this.user.roles[0].name = "ROLE_ADMIN") {
        this.user.roles[0].name = "admin"
      } else {
        this.user.roles[0].name = "user"
      }
      console.log(this.user);
    }, error => {
      console.log(error);
    });
  }

  onSubmit(): void {
    console.log(this.user);
    this.userService.updateUser(this.id, this.user).subscribe(data => {
        console.log(data);
        this.router.navigateByUrl('/admin/user');
      },
      error => {
        // this.isCreateFailed = true;
        console.log(error);
      });
  }
}
