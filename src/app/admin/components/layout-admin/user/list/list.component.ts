import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../../service/user.service";
import Swal from 'sweetalert2';
declare var $:any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  users : any = [];
  public search !: any;
  masterSelected !: boolean;
  checkedList:any =[];
  user: any;
  page: number = 1;
  constructor(
    private userService: UserService
  ) {
    this.masterSelected = false;
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe((data:any) => {
        this.users = data;
      },
      (error:any) => {
        console.log(error);
      });
  }
  onSearch(): void {
    if(this.search =='' || !this.search) {
      this.ngOnInit();
    } else {
      this.users = this.users.filter((data:any) => {
        // console.log(data);
        return data.username.toLocaleLowerCase().match(this.search.toLocaleLowerCase());
      })
    }
  }
  key = 'id';
  reverse: boolean = false;

  sort(key:any) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  removeUser(id: number): void {
    this.userService.deleteUser(id).subscribe(data => {
        for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].id == id) {
            this.users.splice(i, 1);
            break;
          }
        }
      },
      error => {
        console.log(error);
      });
  }

  checkUncheckAll() {
    for (let i = 0; i < this.users.length; i++) {
      this.users[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }
  isAllSelected() {
    this.masterSelected = this.users.every((item:any) => {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList(){
    this.checkedList = [];
    for (let i = 0; i < this.users.length; i++) {
      if(this.users[i].isSelected)
        this.checkedList.push(this.users[i]);
    }
    console.log(this.checkedList);
    // this.checkedList = JSON.stringify(this.checkedList);
  }

  onRemoveCheckedList() {
    let checkedListId = [];
    for (let i = 0; i < this.checkedList.length; i++) {
      checkedListId.push(this.checkedList[i].id);
    }
    this.userService.removeUsers(checkedListId).subscribe(data => {
        if (this.checkedList.length>0)
          for (let i = 0; i < this.checkedList.length; i++) {
            for (let j = 0; j < this.users.length; j++) {
              if (this.checkedList[i].id == this.users[j].id) {
                this.users.splice(j, 1);
                break;
              }
            }
          }
        this.onSearch();
        this.checkedList = [];
      },
      error => {
        console.log(error)
      });
  };

  blockStatus(user:any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "To change user status ?!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        user.blocked = !user.blocked;
        console.log(user);
        this.userService.updateUser(user.id, user).subscribe(data => {
            // console.log(data);
            this.ngOnInit();
          },
          error => {
            console.log(error);
          });
        Swal.fire(
          'Changed!',
          'Your selected User has been changed.',
          'success'
        )
      }
    })
  }


  // showModalBlock(user:any): void {
  //   this.user = user;
  //   $('#blockNotification').modal('show');
  //   $('#blockNotification').on('shown.bs.modal', function () {
  //     console.log("a");
  //     // $('#myInput').trigger('focus')
  //   })
  // }
  //
  // changeBlocked() {
  //   this.blockStatus();
  //
  // }
  // blockStatus() {
  //   this.user.blocked = !this.user.blocked;
  //   this.userService.updateUser(this.user.id, this.user).subscribe(data => {
  //       console.log(data);
  //       this.ngOnInit();
  //       $('#blockNotification').modal('hide');
  //     },
  //     error => {
  //       console.log(error);
  //     });
  // }
}
