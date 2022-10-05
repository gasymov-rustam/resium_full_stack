import { Types } from "mongoose";

export interface IUser {
  id?: Types.ObjectId;
  email?: string;
  password?: string;
  isActivated?: Boolean;
  activationLink?: string;
  __v?: number;
}
