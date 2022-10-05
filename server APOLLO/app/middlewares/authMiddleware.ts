import jwt from "jsonwebtoken";
import { JwtPayload } from "jwt-decode";
import { Response, NextFunction } from "express";
import { UserModel } from "../src/models";
import { IUser } from "../src/types/IUser";
import { IRequest } from "../src/types";

export const authMiddleware = async (req: IRequest, res: Response, next: NextFunction) => {
  // const authHead = req.get("Cookie");
  const authHead = req.get("Authorization");

  if (!authHead) {
    req.isAuth = false;
    return next();
  }

  const token = authHead.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  // Verify the extracted token
  let decodedToken: JwtPayload | any;
  try {
    // decodedToken = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
    decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  // If decoded token is null then set authentication of the request false
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // If the user has valid token then Find the user by decoded token's id
  let authUser: IUser | null = await UserModel.findById(decodedToken?.id);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.user = authUser;

  return next();
};
