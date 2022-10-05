import { ObjectId } from "mongodb";

export interface IUserDto {
  email: string;
  id: ObjectId;
  isActivated: Boolean;
  iat?: number;
  exp?: number;
}

export class UserDto {
  email;
  id;
  isActivated;

  constructor(model: any) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
  }
}
