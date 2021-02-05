import {Component, OnInit} from '@angular/core';
import {PersonalPageService} from '../../services/personal-page.service';
import {Post} from '../../model/dung/post';
import {User} from '../../model/dung/user';
import {Comment} from '../../model/dung/comment';
import {Photo} from '../../model/dung/photo';
import Swal from 'sweetalert2';

declare var $: any;
import {Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-personalpage',
  templateUrl: './personalpage.component.html',
  styleUrls: ['./personalpage.component.css']
})
export class PersonalpageComponent implements OnInit {
  //createpost
  imgSrc = '';

  newPost: Post = {
    content: '',
    photoList: []
  };

  isULoginEqualUOwn = false;

  //create comment
  newComment: Comment = {
    content: '',
    post_id: 0
  };


//edit post
  postToEdit: Post = {};
  commentToEdit: Comment = {};


  // get post List
  userWhoOwnThisPage: User = {
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
  };
  postList: Post[] = [];


  constructor(public sv: PersonalPageService, private router: Router, private aRouter: ActivatedRoute) {
  }

  ngOnInit(): void {


    // @ts-ignore
    this.userWhoOwnThisPage.username = this.aRouter.snapshot.paramMap.get('username');

    this.sv.getUser(this.userWhoOwnThisPage.username!).subscribe(res => {
      this.userWhoOwnThisPage = res;
    });

    // @ts-ignore
    this.userWhoLogin.username = sessionStorage.getItem('username');

    console.log(this.userWhoLogin.username);

    this.sv.getUser(this.userWhoLogin.username!).subscribe(res => {
      this.userWhoLogin = res;
    });

    if (this.userWhoLogin.username == this.userWhoOwnThisPage.username) {
      this.isULoginEqualUOwn = true;
    }

    this.sv.getListPost(this.userWhoOwnThisPage.username!).subscribe(res => {
      this.postList = res;
    });
  }

  //createpost
  submit() {
    if (this.imgSrc != '') {
      this.newPost.photoList?.push({linkSrc: this.imgSrc});
    }

    this.sv.createPost(this.newPost, this.userWhoLogin.username!).subscribe(
      res => {
        this.postList.unshift(res);
        Swal.fire({
          icon: 'success',
          title: 'Post create successfully!',
          showConfirmButton: false,
          timer: 500
        });
      },
      error => {
        alert('false to post');
      }
    );
    this.newPost = {
      content: '',
      photoList: []
    };
    this.imgSrc = '';

  }

  moreImg() {
    var linkSrc = this.imgSrc;
    if (linkSrc != '') {
      this.newPost.photoList?.push({linkSrc: linkSrc});
    }
    this.imgSrc = '';
  }

  comment(postid: any) {
    this.newComment.post_id = postid;
    this.newComment.user_id = this.userWhoLogin.id;
    this.sv.createComment(this.newComment, this.userWhoLogin.username!).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == postid) {
          this.postList[i].commentList!.push(res);
          $(`#inputComment${this.postList[i].id}`).val('');
        }
        break;
      }
    });
  }

  onCommentChance(event: any) {
    this.newComment.content = event.target.value;
  }

  deletePost(postid: any) {
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
        this.sv.deletePost(this.userWhoLogin.username!, postid).subscribe(res => {
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
    });
  };

  editPost(p: Post) {
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
      commentList: p.commentList
    };


    $('#editPostModal').modal('show');
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
    this.sv.updatePost(this.userWhoLogin.username, this.postToEdit).subscribe(res => {
      for (let i = 0; i < this.postList.length; i++) {
        if (this.postList[i].id == res.id) {
          this.postList[i] = res;
          $('#editPostModal').modal('toggle');
        }
      }
    }, error => {
      alert('server false to update post');
    });
  }


  isULoginEqualUOwnthisComment(username: any) {
    if (username == this.userWhoLogin.username) {
      return true;
    }
    return false;
  }

  editComment(cm: Comment) {
    this.commentToEdit = {
      id: cm.id,
      content: cm.content
    };

    $('#editCommentModal').modal('show');
  }


  deleteComment(comment_id: any, post_index: any, comment_index: any) {
    this.sv.deleteComment(this.userWhoLogin.username, comment_id).subscribe(res => {
      if (res) {
        this.postList[post_index].commentList!.splice(comment_index, 1);
      }
    });
  }

  saveEditComment() {
    this.sv.updateComment(this.userWhoLogin.username, this.commentToEdit).subscribe(res => {
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

  onSelect(username: string) {
    console.log(username);
    this.router.navigate(['/index/personal', username]).then(() => {
      window.location.reload();
    });
  }
}
