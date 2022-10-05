import jwt from "jsonwebtoken";
import { Response } from "express";
import { IUser } from "../../types";
import { TokenModel } from "../../models";
import * as userService from "./user.service";

export const generateTokens = (payload: IUser) => {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "";
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "5m" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "20m" });

  return { accessToken, refreshToken };
};

export const saveToken = async (userId: string, refreshToken: string) => {
  const tokenData = await TokenModel.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = await TokenModel.create({ user: userId, refreshToken });
  return token;
};

export const createTokenForUser = async (data: { user: IUser; res: Response }) => {
  const userDto = userService.serializeUser(data.user); // ..ложим юзера и в итоге получаем три поля id, email, isActivated

  const tokens = generateTokens({ ...userDto });

  // data.res.acc access-control-expose-headers: Set-Cookie
  data.res.cookie("refreshToken", tokens.refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // secure: false,
  });

  data.res.header("Access-Control-Expose-Headers", "Set-Cookie");
  await saveToken(userDto.id, tokens.refreshToken);

  return { ...tokens, user: userDto };
};

export const validateAccessToken = (token: string) => {
  try {
    // const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "");
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? "");

    return userData;
  } catch (error) {
    return null;
  }
};
