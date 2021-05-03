export interface IUser {
    readonly username: string;
    readonly email: string;
    password: string;
    readonly terms_agreed: Date;
  }