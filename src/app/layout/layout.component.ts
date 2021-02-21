import { Component, OnInit } from '@angular/core';
import {Friend} from "../model/friend";
import {FriendShipService} from "../services/friendshipservice";
import {ActivatedRoute, Router} from "@angular/router";
import {ChatMessage} from "../model/chat-message";
import {UserService} from "../admin/service/user.service";
import {ChatRoomService} from "../services/chat-room.service";
import {ChatMessageService} from "../services/chat-message.service";

// @ts-ignore
declare var $;
// @ts-ignore
declare var SockJS;
// @ts-ignore
declare var Stomp;

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  username: any;
  friends: Friend[] = [];

  input!: string;
  user: any;
  friend: any;
  // @ts-ignore
  // friends: any[];
  // username: any;
  chatroom: any;
  chatMessages!: any[];
  // @ts-ignore
  public stompClient;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private friendShipService: FriendShipService,
              // public messageService: MessageService,
              public userService: UserService,
              public chatRoomService: ChatRoomService,
              public chatMessageService: ChatMessageService
  ){ }

  ngOnInit(): void {
    this.reloaddata();
  }

  async reloaddata() {
    this.username = sessionStorage.getItem('AuthUsername');
    let friendResponse = await this.getFriendList(this.username);
    this.friends = friendResponse.data;

    this.getUser();
    // this.getAllFriends();
  };


  goToPersonal(username: any) {
    this.router.navigate(['index/personal',username]);
  }

  getFriendList(username: any) {
    return this.friendShipService.getFriendList(username).toPromise();
  };

  getUser() {
    if (this.username) {
      this.userService.getUserByUsername(this.username).subscribe(data => {
        console.log(data);
        this.user = data;
      }, error => {
        console.log(error);
      });
    }
  }

  getUserChatTo(friend: any) {
    // console.log(this.user.id);
    this.friend = friend;
    // console.log(this.friend);
    // console.log(this.user);
    this.chatRoomService.getRoomByIds(this.user.id, this.friend.id).subscribe(data => {
      this.chatroom = data;
      console.log(data);
      this.chatMessageService.getChatMessageByRoomId(this.chatroom.id).subscribe(data => {
        this.chatMessages = data;
        console.log(data);
        this.disconnectSocket();
        this.initializeWebSocketConnection(this.chatroom.name);
        $(function (){
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
  }

  closeChat() {
    this.disconnectSocket();
    this.friend = {};
    console.log(this.friend);
    $('#chatForm').collapse('hide');
  }

  sendMessage() {
    // console.log(this.user.id);
    // console.log(this.friend.id);
    if (this.input) {
      let chatMessage:ChatMessage = {
        content: this.input,
        sender:  this.user,
        receiver: this.friend,
        chat_room_id: this.chatroom.id,
        user_sender_id: this.user.id,
        user_receiver_id: this.friend.id
      }
      this.sendMessageTo(chatMessage);
      this.input = '';
    }
  }


  public initializeWebSocketConnection(roomChatName: any) {
    const serverUrl = 'http://localhost:8080/socket';
    const ws = new SockJS(serverUrl);
    console.log(ws);
    this.stompClient = Stomp.over(ws);
    const that = this;
    // tslint:disable-next-line:only-arrow-functions
    this.stompClient.connect({}, function(frame: any) {
      console.log(frame)
      that.stompClient.subscribe(roomChatName, (message: any) => {
        console.log(message);
        let data = JSON.parse(message.body)
        console.log(data);
        if (data) {
          // @ts-ignore
          that.chatMessages.push(data);
          $(function (){
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

  sendMessageTo(chatMessage: any) {
    console.log(chatMessage);
    this.stompClient.send('/app/send/message/'+ this.chatroom.id, {}, JSON.stringify(chatMessage));
  }

}
