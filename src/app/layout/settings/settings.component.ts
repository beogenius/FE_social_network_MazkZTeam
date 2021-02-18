import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {User} from '../../model/dung/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  user: User = {};
  userUpdate: User = {};
  imgControl = true;

  msg = '';
  constructor(private sv:SettingsService) { }

  ngOnInit(): void {
    // @ts-ignore
    this.user.username = sessionStorage.getItem('AuthUsername');
    // @ts-ignore
    this.sv.getUser(this.user.username).subscribe(res =>{
      this.user = res;
      this.userUpdate.username = res.username;
      this.userUpdate.avatar = res.avatar;
      this.userUpdate.id = res.id;
      this.userUpdate.lastName = res.lastName;
      this.userUpdate.firstName = res.firstName;
      this.userUpdate.address = res.address;
      this.userUpdate.dateOfBirth = res.dateOfBirth;
      this.userUpdate.detail = res.detail;
      this.userUpdate.email = res.email;
      this.userUpdate.gender = res.gender;
      this.userUpdate.phone = res.phone;
    })
  }


  onSubmit() {

    if(this.user.username != ''){
      this.userUpdate.username = this.user.username;
    }
    if(this.user.avatar != ''){
      this.userUpdate.avatar = this.user.avatar;
    }
    if(this.user.lastName != ''){
      this.userUpdate.lastName = this.user.lastName;
    }
    if(this.user.firstName != ''){
      this.userUpdate.firstName = this.user.firstName;
    }
    if(this.user.address != ''){
      this.userUpdate.address = this.user.address;
    }
    if(this.user.dateOfBirth != ''){
      this.userUpdate.dateOfBirth = this.user.dateOfBirth;
    }
    if(this.user.detail != ''){
      this.userUpdate.detail = this.user.detail;
    }
    if(this.user.email != ''){
      this.userUpdate.email = this.user.email;
    }
    if(this.user.lastName != ''){
      this.userUpdate.gender = this.user.gender;
    }
    if(this.user.lastName != ''){
      this.userUpdate.phone = this.user.phone;
    }

    this.sv.updateInfo(this.userUpdate).subscribe(res =>{ this.msg = 'success';alert(this.msg)},error => {this.msg = 'false';alert(this.msg)});

  }


  deleteAvatar() {
    this.user.avatar = '';
    this.imgControl = false;
  }

  showImg() {
    this.imgControl = true;
  }
}
