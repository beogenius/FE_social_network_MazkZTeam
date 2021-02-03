export class SignUpInfor {
  public username: string;
  public password: string;
  public roles: any[];
  public firstName: string;
  public lastName: string;
  public email: string;
  public address: number;
  public avatar = 'aaaa';
  public dateOfBirth: any;


  constructor(username: string, password: string, firstName: string, lastName: string, email: string, address: number, dateOfBirth: any) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.address = address;
    this.avatar = 'aaaa';
    this.dateOfBirth = dateOfBirth;
    this.roles = [
      {
        name: 'user'
      }
    ];
  }
}
