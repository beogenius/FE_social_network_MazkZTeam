import { Component, OnInit } from '@angular/core';
import {PersonalPageService} from '../../services/personal-page.service';
import {Post} from '../../model/dung/post';
import {User} from '../../model/dung/user';


@Component({
  selector: 'app-personalpage',
  templateUrl: './personalpage.component.html',
  styleUrls: ['./personalpage.component.css']
})
export class PersonalpageComponent implements OnInit {
  //createpost
  imgSrc = '';

  newPost: Post = {
    content:'',
    photoList:[]
  };

// get post List
  userWhoOwnThisPage: User ={
    address: '',
    avatar: '',
    blocked: false,
    createdDate: '',
    dateOfBirth: '',
    detail: '',
    email: '',
    firstName: '',
    gender: '',
    id: 0,
    lastName: '',
    password: '',
    phone: '',
    roles: [],
    username: ''
  };
  postList: Post[] = [];


  constructor(public sv: PersonalPageService) { }

  ngOnInit(): void {
    this.sv.getUserOwn('dung').subscribe(res =>{
      this.userWhoOwnThisPage = res;
    });

    this.sv.getListPost('dung').subscribe(res => {
      this.postList = res
    });
  }

  //createpost
  submit() {
    this.newPost.photoList?.push({linkSrc: this.imgSrc});
    this.sv.createPost(this.newPost,'dung').subscribe(
      res => {}
    );
    alert("success");
  }

  moreImg() {
     var linkSrc = this.imgSrc;
    this.newPost.photoList?.push({linkSrc: linkSrc});
    this.imgSrc = '';
  }
}
