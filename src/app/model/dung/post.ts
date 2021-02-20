export interface Post {
  id?: number;
  content?: string;
  user?: any;
  user_id?:number;
  createdDate?:string;
  modifiedAt?:string;
  photoList?:any[];
  commentList?:any[];
  emoteList?: any[];
  isLiked?: boolean;
  protective?: any;
  club?:any;
  club_id?:number | 9999;
}

