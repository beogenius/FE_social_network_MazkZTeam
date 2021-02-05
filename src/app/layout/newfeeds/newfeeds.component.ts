import {Component, OnInit} from '@angular/core';
import {Post} from "../../model/newfeedpost";
import {NewfeedservicesService} from "../../services/newfeedservices.service";
import {User} from "../../model/hai/user";
import {Comment} from "src/app/model/hai/Comment"
import Swal from 'sweetalert2';
import {Emote} from "../../model/hai/emote";

declare var $: any;

@Component({
  selector: 'app-newfeeds',
  templateUrl: './newfeeds.component.html',
  styleUrls: ['./newfeeds.component.css']
})
export class NewfeedsComponent implements OnInit {

  postList: Post[] = [];

  imgSrc = '';

  newPost: Post = {
    content: '',
    photoList: []
  };

  isULoginEqualUOwn = true;
  // commentList : any[] = [];
  userWhoLoginFriends: User = {
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
    username: 'bacsihai' + "a"
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
    username: 'bacsihai'
    //se~ get user by session
  };
  newComment: Comment = {
    content: '',
    post_id: 0
  };

  like: Emote = {
    id: '',
    post_id: '',
    user_id: '',
    comment_id: '',
  };


  constructor(public ps: NewfeedservicesService) {
  }

  ngOnInit(): void {
    this.reloadData();

  }

  reloadData() {
    this.ps.getUser(this.userWhoLogin.username!).subscribe(res => {
      this.userWhoLogin = res;
      this.ps.getAllPost(this.userWhoLogin.username!).subscribe(response => {
        this.postList = response.data;
        this.postList.map(async post => {
          let isLike = await this.isLiked(this.userWhoLogin.username, post.id);
          post.isLiked = isLike.data > 0;
        })
      });
    });

  }

  isLiked(username: any, postId: any){
    return this.ps.checkIsLiked(postId,username).toPromise();
  }


  moreImg() {
    var linkSrc = this.imgSrc;
    this.newPost.photoList?.push({linkSrc: linkSrc});
    this.imgSrc = '';
  }

  submit() {
    this.newPost.photoList?.push({linkSrc: this.imgSrc});
    this.ps.createPost(this.newPost, this.userWhoLogin.username!).subscribe(
      res => {
        this.reloadData();
        Swal.fire({
          icon: 'success',
          title: 'Post create successfully!',
          showConfirmButton: false,
          timer: 500
        })
      },
      error => {
        alert("false to post");
      }
    );
    this.newPost = {
      content: '',
      photoList: []
    };
    this.imgSrc = '';
  }

  deletePost(postid: number) {
    Swal.fire({
      title: 'Are you sure to Delete this POST ? ',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ps.deletePost(this.userWhoLogin.username!, postid).subscribe(res => {
          if (res) {
            let a = 0;
            for (let i = 0; i < this.postList.length; i++) {
              if (this.postList[i].id == postid) {
                a = i;
              }
            }
            this.postList.splice(a, 1);
            Swal.fire(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          }

        });
      }
    })
  };


  onCommentChance(event: any) {
    this.newComment.content = event.target.value;
  }

  comment(postid: number) {
    console.log(postid);

    this.newComment.post_id = postid;
    this.newComment.user_id = this.userWhoLogin.id;
    this.ps.createComment(this.newComment, this.userWhoLogin.username!).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == postid) {
          this.postList[i].commentList?.push(res);
          $(`#inputComment${this.postList[i].id}`).val('');
          break;
        } else {
          console.log("sai logic");
        }
      }
    })
  }



  likePostAction(postid: any) {
    console.log(postid);
    this.like.post_id = postid;
    this.like.user_id = this.userWhoLogin.id;
    this.ps.addLike(this.like, this.userWhoLogin.username!).subscribe(res =>{
      this.reloadData();
    });
  }

  dislikeAction(postid: any) {
    console.log(postid);
    this.like.post_id = postid;
    this.like.user_id = this.userWhoLogin.id;
    this.ps.disLike(this.like.post_id, this.userWhoLogin.username!).subscribe(res => {
      this.reloadData();
    })
  }


}
