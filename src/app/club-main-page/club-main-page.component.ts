import { Component, OnInit } from '@angular/core';
import {User} from '../model/dung/user';
import {ActivatedRoute, Router} from '@angular/router';
import {Post} from '../model/newfeedpost';
import {Comment} from '../model/hai/Comment';
import {Emote} from '../model/hai/emote';
import {NewfeedservicesService} from '../services/newfeedservices.service';
import Swal from "sweetalert2";
import {ClubService} from '../services/club.service';
import {FriendShipService} from '../services/friendshipservice';
import {ClubMainPageService} from '../services/club-main-page.service';
import {Club} from '../model/dung/club';

declare var $: any;
@Component({
  selector: 'app-club-main-page',
  templateUrl: './club-main-page.component.html',
  styleUrls: ['./club-main-page.component.css']
})
export class ClubMainPageComponent implements OnInit {

  club: Club = {};
  //get post LIST
  postList: Post[] = [];
  memberList: User[] =[];
  reqJoinList: User[] =[];
  startPage: any;
  paginationLimit: any;

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
    username: ''
    //se~ get user by session
  };

  //Create posst
  imgSrc = '';

  newPost: Post = {
    content: '',
    photoList: []
  };

  //Bien edit post
  postToEdit: Post = {};

  //create comment
  newComment: Comment = {
    content: '',
    post_id: 0
  };

  // nut like
  like: Emote = {
    id: '',
    post_id: '',
    user_id: '',
    comment_id: '',
  };


  constructor(public ps: NewfeedservicesService,
              private CmpSv: ClubMainPageService,
              private router: Router,
              private aRouter: ActivatedRoute,
              private sv: ClubService){
  }

  ngOnInit(): void {
    this.aRouter.paramMap.subscribe(param =>{
      this.club.name = param.get('clubname')!;
      this.reloadData();
    })

  }

  reloadData() {
    // @ts-ignore
    this.userWhoLogin.username = sessionStorage.getItem('AuthUsername');

    this.ps.getUser(this.userWhoLogin.username!).subscribe(res => {
      this.userWhoLogin = res;
      console.log(this.userWhoLogin.id);
    });

    this.CmpSv.getClub(this.userWhoLogin.username!,this.club.name).subscribe(res => {
      this.club = res;
      console.log(this.club.founder_id);
    });

    this.CmpSv.getPostList(this.userWhoLogin.username!,this.club.name).subscribe(data => {
      this.postList = data;
      for (let i = 0; i < this.postList.length; i++) {
        this.postList[i].isLiked = this.isUserWhoLoginLikeThisPost(this.postList[i]);
        for (let j = 0; j < this.postList[i].commentList!.length; j++) {
          this.postList[i].commentList![j].isLiked = this.isUserWhoLoginLikeThisComment(this.postList[i].commentList![j]);
        }
      }
    })

    this.CmpSv.getMemberList(this.userWhoLogin.username!,this.club.name).subscribe(data => {
      this.memberList = data;
    })

    this.CmpSv.getReqJoinList(this.userWhoLogin.username!,this.club.name).subscribe(data => {
      this.reqJoinList = data;
    })

  }

  isUserWhoLoginLikeThisComment(cm: Comment) {
    for (let i = 0; i < cm.emoteList?.length!; i++) {
      if (cm.emoteList![i].user.id == this.userWhoLogin.id) {
        return true;
      }
    }
    return false;
  }

  isUserWhoLoginLikeThisPost(p: Post) {
    for (let i = 0; i < p.emoteList?.length!; i++) {
      if (p.emoteList![i].user.id == this.userWhoLogin.id) {
        return true;
      }
    }
    return false;
  }

  moreImg() {
    var linkSrc = this.imgSrc;
    if(this.imgSrc !==''){
      this.newPost.photoList?.push({linkSrc: linkSrc});
      this.imgSrc = '';
    }
  }

  submit() {
    if(this.imgSrc !==''){
      this.newPost.photoList?.push({linkSrc: this.imgSrc});
    }
    if(!this.newPost.protective) {
      this.newPost.protective = 1;
    }
    this.newPost.club_id = this.club.id;
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

    this.newComment.post_id = postid;
    this.newComment.user_id = this.userWhoLogin.id;
    this.ps.createComment(this.newComment, this.userWhoLogin.username!).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == postid) {
          this.postList[i].commentList?.push(res);
          $(`#inputComment${this.postList[i].id}`).val('');
          break;
        } else {

        }
      }
    })
  }

  likePostAction(post_id: any) {
    let emote: Emote = {
      post_id: post_id,
      user_id: this.userWhoLogin.id
    };

    this.ps.addLike(this.userWhoLogin.username!, emote).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == post_id) {
          this.postList[i].emoteList!.push(res);
          this.postList[i].isLiked = true;
        }
      }
    }, error => {
      console.log('false to like');
    });
  }

  editPost(p: Post) {
    //edit post begin
    function getPL(photoList: any[]) {
      let a = [];

      for (let i = 0; i < photoList.length; i++) {
        a.push({
          linkSrc: photoList[i].linkSrc
        });
      }
      return a;
    }
    this.postToEdit = {
      id: p.id,
      content: p.content,
      user: p.user,
      user_id: p.user_id,
      createdDate: p.createdDate,
      modifiedAt: p.modifiedAt,
      photoList: getPL(p.photoList!),
      commentList: p.commentList,
      protective: p.protective
    };
    $('#editPostModal').modal('show');
    //edit post end - > show modal
  }

  deletePhoto(i: number) {
    this.postToEdit.photoList?.splice(i, 1);
  }

  saveEditPhoto() {
    this.postToEdit.photoList?.push({
      linkSrc: this.imgSrc,
    });
    this.imgSrc = '';
  }

  saveEditPost() {
    this.ps.updatePost(this.userWhoLogin.username, this.postToEdit).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == res.id) {
          this.postList[i] = res;
          $('#editPostModal').modal('toggle');
          this.reloadData();
        }
      }
    }, error => {
      alert('server false to update post');
    });
  }

  //router
  onSelect(commentUserName: string) {
    this.router.navigate(['/index/personal', commentUserName]).then(() => {
      window.location.reload();
    });
  }

  isULoginEqualUOwnthisComment(username: any) {
    if (username == this.userWhoLogin.username) {
      return true;
    }
    return false;
  }

  //Bien edit comment
  commentToEdit: Comment = {};

  editComment(cm: Comment) {
    this.commentToEdit = {
      id: cm.id,
      content: cm.content
    };

    $('#editCommentModal').modal('show');
  }

  deleteComment(comment_id: any, post_index: any, comment_index: any) {
    this.ps.deleteComment(this.userWhoLogin.username, comment_id).subscribe(res => {
      if (res) {
        this.postList[post_index].commentList!.splice(comment_index, 1);
      }
    });
  }

  saveEditComment() {
    this.ps.updateComment(this.userWhoLogin.username, this.commentToEdit).subscribe(res => {
        let post: Post = {};
        for (let i = 0; i < this.postList.length; i++) {
          if (this.postList[i].id == res.post_id) {
            post = this.postList[i];
          }
        }

        post.commentList;

        for (let i = 0; i < post.commentList!.length; i++) {
          if (post.commentList![i].id == res.id) {
            post.commentList![i] = res;
          }
        }

        $('#editCommentModal').modal('toggle');
      },
      error => {
        $('#editCommentModal').modal('toggle');
        alert('server false to update comment');
      });
  }

  dislikePostAction(post_id: any) {
    this.ps.disLike( post_id,this.userWhoLogin.username!).subscribe(res => {
      if (res) {
        for (let i = 0; i < this.postList.length; i++) {
          if (this.postList[i].id == post_id) {
            this.removeEmote(this.postList[i].emoteList!);
            this.postList[i].isLiked = false;
          }
        }
      } else {
        alert('loi server');
      }

    });
  }

  removeEmote(emoteList: Emote[]) {
    for (let i = 0; i < emoteList.length; i++) {
      if (emoteList[i].user_id == this.userWhoLogin.id) {
        emoteList.splice(i, 1);
        break;
      }
    }
  }

  likeCommentAction(cm_id: any, post_id: any) {
    let emote: Emote = {
      comment_id: cm_id,
      user_id: this.userWhoLogin.id
    };
    this.ps.addLike(this.userWhoLogin.username!, emote).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == post_id) {
          for (let j = 0; j < this.postList[i].commentList!.length; j++) {
            if (this.postList[i].commentList![j].id == cm_id) {
              this.postList[i].commentList![j].emoteList.push(res);
              this.postList[i].commentList![j].isLiked = true;
            }
          }
        }
      }
    }, error => {
      console.log('false to like');
    });
  }

  dislikeCommentAction(cm_id: any, post_id: any) {
    this.ps.disLikeComment(this.userWhoLogin.username, cm_id).subscribe(res => {
      if (res) {
        for (let i = 0; i < this.postList.length; i++) {
          if (this.postList[i].id == post_id) {
            for (let j = 0; j < this.postList[i].commentList!.length; j++) {
              if (this.postList[i].commentList![j].id == cm_id) {
                this.removeEmote(this.postList[i].commentList![j].emoteList);
                this.postList[i].commentList![j].isLiked = false;
              }
            }
          }
        }
      } else {
        alert('loi server');
      }
    });
  }

  deletePhotoNewPost(i: any) {
    this.newPost.photoList?.splice(i, 1);
  }

  isULoginEqualUOwnthisPost(username : any) : boolean {
    if (username == this.userWhoLogin.username){
      return true;
    }
    return false;
  }

  kickMember(memberid: any,index: any) {
    Swal.fire({
      title: 'Are you sure to Kick this Member ? ',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) =>{
      if(result.isConfirmed){
        this.CmpSv.kickMenber(this.userWhoLogin.username,this.club.name,memberid).subscribe(res =>{
            if(res){
              this.memberList.splice(index,1);
            } else {
              alert("server false");
            }
        },error => {alert("server false")})
      }
    })

    // dang lam do o day


  }

  AcceptReq(userReq: User,index: any) {
    this.CmpSv.acceptJoinReq(this.userWhoLogin.username,this.club.name,userReq.id).subscribe(res =>{
      if(res){
        this.reqJoinList.splice(index,1);
        this.memberList.unshift(userReq);
      }else {
        alert("server false");
      }
    },error => {alert("server false")})
  }

  Deny(userReq: User,index: any) {
    this.CmpSv.refuseJoinReq(this.userWhoLogin.username,this.club.name,userReq.id).subscribe(res =>{
      if(res){
        this.reqJoinList.splice(index,1);
      }else {
        alert("server false");
      }
    },error => {alert("server false")})
  }
}
