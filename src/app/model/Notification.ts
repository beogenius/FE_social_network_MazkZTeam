import {User} from "./hai/user";

export class Notification {
  id?: number;
  typeNoti?: string;
  userSender?: User;
  user_sender_id?: number;
  userReceiver?: User;
  user_receiver_id?: number;
  status?: boolean;
  createdDate?:any;
}

