export interface User {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatar?: string;
  detail?: string;
  createdDate?: string;
  blocked?: boolean;
  roles:any[];
}
