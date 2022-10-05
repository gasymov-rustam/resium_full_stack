import { Response } from "express";
import { PlaneDocument } from "../models/Plane";
import { TokenInput } from "../models/Token";
import { UserInput } from "../models/User";
import { IRequest } from "./IRequest";
import { IUser } from "./IUser";

export interface IContext {
  res: Response;
  req: IRequest;
  user?: IUser;
  isAuth?: Boolean;
  Plane: PlaneDocument;
  User: UserInput;
  Token: TokenInput;
}
