import jwt from "jsonwebtoken";
import { Types } from "mongoose";
// import * as planesService from "../service/plain.service";
import { IContext } from "../../types";
import { PlaneModel } from "../../models";
import { ApolloError, AuthenticationError } from "apollo-server-express";
import { PlaneDocument } from "../../models/Plane";

export default {
  Query: {
    getAllPlanes: async (_: null, __: null, { req, isAuth, user }: IContext) => {
      try {
        // if (!req.isAuth) {
        //   return new AuthenticationError("JWT is not valid please sign up");
        // }

        return await PlaneModel.find({ userId: user?.id });
      } catch (error: any) {
        return new ApolloError(error.message, "401");
      }
    },
    getPlane: async (_: undefined, { id }: Types.ObjectId, context: IContext) => {
      try {
        return await PlaneModel.findById(id);
      } catch (error: any) {
        return new ApolloError(error.message, "404");
      }
    },
  },
  Mutation: {
    createPlane: async (
      _: undefined,
      args: { input: PlaneDocument },
      { req, isAuth, user }: IContext
    ) => {
      try {
        // if (!req.isAuth) {
        //   return new AuthenticationError("JWT is not valid please sign up");
        // }

        const existPlane = await PlaneModel.findOne({ name: args.input.name });

        if (existPlane) {
          return new ApolloError("Plane allready exist!!", "409");
        }

        const createdPlane = await PlaneModel.create(args.input);

        return createdPlane;
      } catch (error: any) {
        return new ApolloError("Unable to create, try again later", "404");
      }
    },
    updatePlane: async (_: undefined, args: { input: PlaneDocument }, { req }: IContext) => {
      try {
        // if (!req.isAuth) {
        //   return new AuthenticationError("JWT is not valid please sign up");
        // }

        const existPlane = await PlaneModel.findOne({ name: args.input.name });

        if (existPlane) {
          return new ApolloError("Plane allready exist!!", "409");
        }

        const updatedPlane = await PlaneModel.findByIdAndUpdate(args.input.id, args.input, {
          new: true,
        });

        return updatedPlane;
      } catch (error: any) {
        return new ApolloError("Unable to update, try again later", "404");
      }
    },
    deletePlane: async (_: undefined, { id }: Types.ObjectId, { req }: IContext) => {
      try {
        // if (!req.isAuth) {
        //   return new AuthenticationError("JWT is not valid please sign up");
        // }

        return await PlaneModel.findByIdAndDelete(id);
      } catch (error: any) {
        return new ApolloError("Unable to delete, try again later", "404");
      }
    },
  },
};

// const { refreshToken } = context.req?.cookies;
//         const user = validateAccessToken(refreshToken);

//         if (!user) {
//           return ApiError.UnauthorizedError();
//         }
