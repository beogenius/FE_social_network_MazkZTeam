export interface Club {
  id?: number;
  name?: string;
  permission?: number;
  createdDate?: string;
  detail?: string;
  founder?: any;
  founder_id?:any;
  members?:any[];
  userReqToJoin?:any[];
}
