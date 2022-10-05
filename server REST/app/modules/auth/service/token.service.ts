import jwt from "jsonwebtoken";
import { TokenModel } from "../models/token.model";
import { UserInput } from "../models/user.model";

export const generateTokens = (payload: any) => {
  const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "";
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: "15s" });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "30s" });

  return { accessToken, refreshToken };
};

export const validateAccessToken = (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "");

    return userData;
  } catch (error) {
    return null;
  }
};

export const validateRefreshToken = (token: string) => {
  try {
    const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? "");

    return userData;
  } catch (error) {
    return null;
  }
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

export const removeToken = async (refreshToken: string) => {
  const tokenData = await TokenModel.deleteOne({ refreshToken });

  return tokenData;
};

export const findToken = async (refreshToken: string) => {
  const tokenData = await TokenModel.findOne({ refreshToken });

  return tokenData;
};
