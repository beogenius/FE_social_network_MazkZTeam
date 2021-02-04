import { Component, OnInit } from '@angular/core';
import {PersonalPageService} from '../../services/personal-page.service';
import {Post} from '../../model/dung/post';
import {User} from '../../model/dung/user';
import {Comment} from '../../model/dung/comment';
declare var $:any;



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

  isULoginEqualUOwn = true;

  //create comment
  newComment: Comment = {
    content:'',
    post_id: 0
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
    username: 'dung'
  };
  userWhoLogin: User = {
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
    username: 'dung'
  };
  postList: Post[] = [];




  constructor(public sv: PersonalPageService) { }

  ngOnInit(): void {
    this.sv.getUser(this.userWhoOwnThisPage.username!).subscribe(res =>{
      this.userWhoOwnThisPage = res;
    });

    this.sv.getUser(this.userWhoLogin.username!).subscribe(res =>{
      this.userWhoLogin = res;
    });


    this.sv.getListPost('dung').subscribe(res => {
      this.postList = res
    });
  }

  //createpost
  submit() {
    this.newPost.photoList?.push({linkSrc: this.imgSrc});
    this.sv.createPost(this.newPost,this.userWhoLogin.username!).subscribe(
      res => {this.postList.unshift(res);
        alert("success post");},
      error => {
        alert("false to post");
      }
    );
    this.newPost = {
      content:'',
      photoList:[]
    };
    this.imgSrc = '';

  }

  moreImg() {
     var linkSrc = this.imgSrc;
    this.newPost.photoList?.push({linkSrc: linkSrc});
    this.imgSrc = '';
  }

  comment(postid: number) {
    this.newComment.post_id = postid;
    this.newComment.user_id = this.userWhoLogin.id;
    this.sv.createComment(this.newComment,this.userWhoLogin.username!).subscribe(res => {
      for (let i = 0;i < this.postList.length;i++){
        if(this.postList[i].id == postid){
          this.postList[i].commentList!.push(res);
          $(`#inputComment${this.postList[i].id}`).val('');
        }
        break;
      }
    })
  }

  onCommentChance(event: any) {
    this.newComment.content = event.target.value;
  }

  deletePost(postid: number) {
    let a = confirm("are you sure want to delete this post?");
    console.log(a);
    if(a){
    this.sv.deletePost(this.userWhoLogin.username!,postid).subscribe(res=>{
      if(res){
        let a = 0;
        for (let i = 0; i < this.postList.length; i++) {
          if(this.postList[i].id == postid){
            a = i;
          }
        }
        this.postList.splice(a,1);
        alert("delete post success");
      }
      else {
        alert("delete post false");
      }
    },error => {alert("delete post false");});
    }
  }
}
