import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as planesService from "../service/plain.service";
import { IUserDto } from "../../../dtos/user-dto";
import { ApiError } from "../../../helpers/AppError";
import { log } from "console";

export const getAllPlanes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: any = req?.headers?.authorization?.split(" ")[1] ?? undefined;
    const user: any = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "") || "";

    if (!user.id) {
      return next(ApiError.UnauthorizedError());
    }

    const planes = await planesService.getAllPlanes(user.id);

    res.send(planes);
  } catch (error) {
    next(error);
  }
};

export const getOnePlane = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(await planesService.getOnePlane(req.params.id));
  } catch (error) {
    next(error);
  }
};

export const createPlane = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json(await planesService.createPlane(req.body));
  } catch (error) {
    next(error);
  }
};

export const updatePlane = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(await planesService.updatePlane(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

export const deletePlane = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.send(await planesService.deletePlane(req.params.id));
  } catch (error) {
    next(error);
  }
};
