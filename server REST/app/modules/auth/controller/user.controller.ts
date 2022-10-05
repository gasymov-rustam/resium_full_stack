import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import * as userService from "../service/user.service";
import { ApiError } from "../../../helpers/AppError";

export const registration = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return next(ApiError.BadRequest("Validation error!!", errors.array()));
    }

    const { email, password } = req.body;
    const userData = await userService.registration(email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    //создаем куки, передаем срок хранения 30 дней считаем тк нельзя передавать строчкой, второй параметр чтоб к ним не было доступа через браузер

    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const userData = await userService.login(email, password);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    //создаем куки, передаем срок хранения 30 дней считаем тк нельзя передавать строчкой, второй параметр чтоб к ним не было доступа через браузер

    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const token = await userService.logout(refreshToken);

    res.clearCookie("refreshToken");

    return res.json(token);
  } catch (error) {
    next(error);
  }
};

export const activate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activationLink = req.params.link;
    await userService.activate(activationLink);

    return res.redirect(process.env.CLIENT_URL ?? "");
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await userService.refresh(refreshToken);

    res.cookie("refreshToken", userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return res.json(userData);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();

    return res.json(users);
  } catch (error) {
    next(error);
  }
};
