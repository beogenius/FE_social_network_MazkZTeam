export class User {
    public id?: any;
    public username?: any;
    public password?: any;
    public firstName?: any
    public lastName?: any
    public address?: any;
    public avatar?: any;
    public blocked?: any;
    public dateOfBirth?: any;
    public detail?: any;
    public email?: any;
    public gender?: any;
    public phone?: any;
    public roles: any = [
      {
        name: "user"
      }
    ];
}
