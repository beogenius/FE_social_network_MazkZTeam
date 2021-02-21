import {Component, Injectable, OnInit} from '@angular/core';
import {Friend} from "../model/friend";
import {FriendShipService} from "../services/friendshipservice";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatMessage} from "../model/chat-message";
import {UserService} from "../admin/service/user.service";
import {ChatRoomService} from "../services/chat-room.service";
import {ChatMessageService} from "../services/chat-message.service";
import {NotificationService} from "../services/notification.service";
import {Pipe, PipeTransform} from '@angular/core';
import {count} from "rxjs/operators";
import {User} from "../model/dung/user";
import {PersonalPageService} from "../services/personal-page.service";
import {Notification} from "../model/Notification";

// @ts-ignore
declare var $;
// @ts-ignore
declare var SockJS;
// @ts-ignore
declare var Stomp;

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  username: any;
  friends: Friend[] = [];

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

  input!: string;
  user: any;
  friend: any;


  // @ts-ignore
  // friends: any[];
  // username: any;
  chatroom: any;
  chatMessages!: any[];
  notifications!: any[];
  public stompClientNotification: any;
  // @ts-ignore
  public stompClient;
  totalPostNotification = 0;

  postNotiList: any[] = [];

  countpostNoti() {
    this.totalPostNotification = 0
    this.friends.map(friend => {
      let CountPost = 0;
      this.notifications.map(noti => {
        if (noti.typeNoti == 'newPost' && friend.id == noti.user_sender_id && this.userWhoLogin.id == noti.user_receiver_id && noti.status == false) {
          this.postNotiList.unshift(noti);
          CountPost++;
        }
        else if (noti.typeNoti == 'newPost' && friend.id == noti.user_sender_id && this.userWhoLogin.id == noti.user_receiver_id && noti.status == true){
          this.postNotiList.push(noti);
        }
      });
      this.totalPostNotification += CountPost;
      // console.log(this.totalPostNotification);
    });
  }


  constructor(private route: ActivatedRoute,
              private router: Router,
              private friendShipService: FriendShipService,
              // public messageService: MessageService,
              public userService: UserService,
              public chatRoomService: ChatRoomService,
              public chatMessageService: ChatMessageService,
              public notificationService: NotificationService,
              public sv: PersonalPageService
  ) {
    this.disconnectNotificationSocket();
    this.initializeWebSocketNotificationConnection();
  }

  ngOnInit(): void {
    this.reloaddata();
    this.getNotifications();


  }

  async reloaddata() {
    this.username = sessionStorage.getItem('AuthUsername');
    let friendResponse = await this.getFriendList(this.username);
    this.friends = friendResponse.data;
    this.getUser();


    this.sv.getUser(this.username!).subscribe(res => {
      this.userWhoLogin = res;
    });

  };

  //notification
  async getNotifications() {
    let user = await this.userService.getUserByUsername(this.username).toPromise();
    this.notificationService.getAllNotifications(user.id).subscribe(async data => {
      this.notifications = data;
      // console.log(data);
      let friendResponse = await this.getFriendList(this.username);
      this.friends = friendResponse.data;

      //post noti setup
      this.postNotiList = [];
      this.countpostNoti();
      //post noti setup end


      //message noti setup
      this.friends.map(friend => {
        let countMessNoti = 0;
        this.notifications.map(noti => {
          if (noti.typeNoti == 'newMessage' && friend.id == noti.user_sender_id) {
            countMessNoti++;
          }
        });
        friend.totalNotification = countMessNoti;
      });

      //message noti setup end
      // console.log(this.notifications);
    }, error => {
      console.log(error)
    })
  }


  //notification message
  public initializeWebSocketNotificationConnection() {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    // console.log(ws);
    this.stompClientNotification = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClientNotification.connect({}, function (frame: any) {
      // console.log(frame)
      that.stompClientNotification.subscribe("/notification", (notification: any) => {
        // console.log(notification);
        let data = JSON.parse(notification.body)
        // console.log(data);
        if (data) {
          if (that.user.id == data.user_receiver_id) {
            // @ts-ignore
            that.notifications.push(data);
            that.getNotifications();
            // that.pushReadedNotificationBackToNotification();

            console.log(that.postNotiList);
            // console.log('total noti post ' + that.totalPostNotification);
            // console.log("notifications: " + that.notifications);
          }
        }
      });
    });
  }

  //notification
  disconnectNotificationSocket() {
    if (this.stompClientNotification) {
      this.stompClientNotification.disconnect();
    }
    // console.log("Disconnected")
  }


  //notification message ENDDDD


  goToPersonal(username: any) {
    this.router.navigate(['index/personal', username]);

  }

  getFriendList(username: any) {
    return this.friendShipService.getFriendList(username).toPromise();
  };

  getUser() {
    if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe(data => {
        // console.log(data);
        this.user = data;
      }, error => {
        console.log(error);
      });
    }
  }


  closeChat() {
    this.disconnectSocket();
    this.friend = {};
    // console.log(this.friend);
    $('#chatForm').collapse('hide');
  }

  sendMessage() {
    // console.log(this.user.id);
    // console.log(this.friend.id);
    if (this.input) {
      let chatMessage: ChatMessage = {
        content: this.input,
        sender: this.user,
        receiver: this.friend,
        chat_room_id: this.chatroom.id,
        user_sender_id: this.user.id,
        user_receiver_id: this.friend.id
      }
      this.sendMessageTo(chatMessage);
      this.input = '';
    }
  }

  sendMessageTo(chatMessage: any) {
    // console.log(chatMessage);
    this.stompClient.send('/app/send/message/' + this.chatroom.id, {}, JSON.stringify(chatMessage));
    //notification
    this.createNotification(this.friend.id);
  }

  //notification
  createNotification(receiverId: any) {
    let notification = {
      typeNoti: "newMessage",
      user_sender_id: this.user.id,
      user_receiver_id: receiverId
    }
    this.stompClientNotification.send('/app/notification', {}, JSON.stringify(notification));
  }

  //notification
  createPostNotificationToAllFriends(receiverId: any) {
    let notification = {
      typeNoti: "newPost",
      user_sender_id: this.user.id,
      user_receiver_id: receiverId
    }
    this.stompClientNotification.send('/app/notification', {}, JSON.stringify(notification));
  }


  public initializeWebSocketConnection(roomChatName: any) {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    // console.log(ws);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function (frame: any) {
      // console.log(frame)
      that.stompClient.subscribe(roomChatName, (message: any) => {
        // console.log(message);
        let data = JSON.parse(message.body)
        // console.log(data);
        if (data) {
          // @ts-ignore
          that.chatMessages.push(data);
          $(function () {
            const chatHistory = $('#chat-history')[0];
            $("#chat-history").scrollTop(chatHistory.scrollHeight);
          })
        }
      });
    });
  }

  disconnectSocket() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected")
  }

  getUserChatToAndDeleteNotification(friend: any, senderId: any) {
    // console.log(this.user.id);
    this.friend = friend;
    // console.log(this.friend);
    // console.log(this.user);
    this.chatRoomService.getRoomByIds(this.user.id, this.friend.id).subscribe(data => {
      this.chatroom = data;
      // console.log(data);
      this.chatMessageService.getChatMessageByRoomId(this.chatroom.id).subscribe(data => {
        this.chatMessages = data;
        // console.log(data);
        this.disconnectSocket();
        this.initializeWebSocketConnection(this.chatroom.name);

        $(function () {
          const chatHistory = $('#chat-history')[0];
          $('#chatForm').collapse('show');
          $("#chat-history").scrollTop(chatHistory.scrollHeight);
        })
      }, error => {
        console.log(error);
      });
    }, error => {
      console.log(error);
    });

//delete noti
    this.notificationService.deleteNotification(senderId, this.username).subscribe(res => {
      this.friends.map(friend => {
        this.notifications.map(noti => {
          if (noti.typeNoti == 'newMessage' && friend.id == noti.senderId) {
            this.notifications.splice(noti, 1);
          }
        });
      });
    });
    friend.totalNotification = 0;

  }


  clearPostNotification() {
    this.totalPostNotification = 0;
    //update notiStatus false -> true;
    this.postNotiList.map(noti => {
      this.notificationService.readNotification(noti).subscribe(res => {
      });
    });
  }

  pushReadedNotificationBackToNotification() {
    this.postNotiList = [];
    this.friends.map(friend => {
      this.notifications.map(noti => {
        if (noti.typeNoti == 'newPost' && friend.id == noti.user_sender_id && this.userWhoLogin.id == noti.user_receiver_id && noti.status == true) {
          this.postNotiList.unshift(noti);
        }
      });
    });
  }
}
