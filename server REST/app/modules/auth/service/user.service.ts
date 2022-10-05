import bcrypt from "bcrypt";
import * as uuid from "uuid";
import * as mailService from "./mail.service";
import * as tokenService from "./token.service";
import { UserInput, UserModel } from "../models/user.model";
import { UserDto } from "./../../../dtos/user-dto";
import { log } from "./../../../helpers/logger";
import { ApiError } from "../../../helpers/AppError";
import { createTokenForUser } from "../../../utils/createTokenForUser";

export const registration = async (email: string, password: string) => {
  const candidate = await UserModel.findOne({ email });

  if (candidate) {
    throw ApiError.BadRequest(`User ${email} allready exist in system`);
  }

  const hashPassword = await bcrypt.hash(password, 3);

  const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

  const user = await UserModel.create({ email, password: hashPassword, activationLink });

  await mailService.sendActivationMail(
    email,
    `${process.env.API_URL ?? ""}/api/activate/${activationLink}`
  );

  return createTokenForUser(user);

  // const userDto = new UserDto(user); // ..ложим юзера и в итоге получаем три поля id, email, isActivated
  // const tokens = tokenService.generateTokens({ ...userDto });

  // await tokenService.saveToken(userDto.id, tokens.refreshToken);

  // return { ...tokens, user: userDto };
};

export const activate = async (activationLink: string) => {
  const user = await UserModel.findOne({ activationLink });

  if (!user) {
    throw ApiError.BadRequest("Uncorrect link for activation");
  }

  user.isActivated = true;
  await user.save();
};

export const login = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw ApiError.BadRequest("User with this email was not find");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw ApiError.BadRequest("Password is not correct");
  }

  return createTokenForUser(user);

  // const userDto = new UserDto(user);
  // const tokens = tokenService.generateTokens({ ...userDto });

  // await tokenService.saveToken(userDto.id, tokens.refreshToken);
  // return { ...tokens, user: userDto };
};

export const logout = async (refreshToken: string) => {
  const token = await tokenService.removeToken(refreshToken);

  return token;
};

export const refresh = async (refreshToken: string) => {
  if (!refreshToken) {
    throw ApiError.UnauthorizedError();
  }

  const userData: any = tokenService.validateRefreshToken(refreshToken);
  const tokenFromDataBase = await tokenService.findToken(refreshToken);

  if (!userData || !tokenFromDataBase) {
    throw ApiError.UnauthorizedError();
  }

  const user = await UserModel.findById(userData.id);

  if (!user) {
    throw ApiError.UnauthorizedError();
  }

  return createTokenForUser(user);

  // const userDto = new UserDto(user);
  // const tokens = tokenService.generateTokens({ ...userDto });

  // await tokenService.saveToken(userDto.id, tokens.refreshToken);
  // return { ...tokens, user: userDto };
};

export const getAllUsers = async () => {
  return await UserModel.find();
};
