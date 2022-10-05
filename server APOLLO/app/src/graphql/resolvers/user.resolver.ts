import * as uuid from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApolloError } from "apollo-server-express";
import * as mailService from "../service/mail.service";
import * as tokenService from "../service/token.service";
import { UserModel, TokenModel } from "../../models";
import { UserInput } from "../../models/User";
import { IContext } from "../../types";

export default {
  Query: {
    refreshUser: async (parent: null, args: null, context: IContext) => {
      const { refreshToken } = context.req.cookies;

      if (!refreshToken) {
        return new ApolloError("User not found please sign up and try again", "401");
      }

      const userData: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET ?? "");
      const tokenFromDataBase = await TokenModel.findOne({ refreshToken });

      if (!userData || !tokenFromDataBase) {
        return new ApolloError("User not found please sign up and try again", "401");
      }

      const user = await UserModel.findById(userData.id);

      if (!user) {
        return new ApolloError("User not found please sign up and try again", "401");
      }
      console.log("refreshhhhhhhhhhhhhhhhhhhh");

      return await tokenService.createTokenForUser({ user, res: context.res });
    },
    activationUser: async (
      parent: null,
      { activationLink }: { activationLink: string },
      context: IContext
    ) => {
      const user = await UserModel.findOne({ activationLink });

      if (!user) {
        return new ApolloError("Uncorrect link for activation", "404");
      }

      user.isActivated = true;
      return await user.save();
    },
  },
  Mutation: {
    registerUser: async (parent: null, args: { input: UserInput }, context: IContext) => {
      try {
        const { email, password } = args?.input;
        const candidate = await UserModel.findOne({ email });

        if (candidate) {
          return new ApolloError(`User ${email} allready exist in system`, "401");
        }

        const activationLink = uuid.v4();

        const hashPassword = await bcrypt.hash(password, 3);

        const user = await UserModel.create({
          email,
          password: hashPassword,
          activationLink,
          isActivated: false,
        });

        await mailService.sendActivationMail(
          email,
          `${process.env.CLIENT_URL ?? ""}/activate/${activationLink}`
        );

        return tokenService.createTokenForUser({ user, res: context.res });
      } catch (error: any) {
        throw new ApolloError(error.message, "400");
      }
    },
    loginUser: async (parent: null, args: { input: UserInput }, context: IContext) => {
      try {
        const { email, password } = args?.input;
        const user = await UserModel.findOne({ email });

        if (!user) {
          return new ApolloError("User with this email was not find", "401");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return new ApolloError("Password is not correct", "404");
        }

        return await tokenService.createTokenForUser({ user, res: context.res });
      } catch (error: any) {
        throw new ApolloError(error.message, "400");
      }
    },
    logoutUser: async (parent: null, args: null, context: IContext) => {
      try {
        const { refreshToken } = context.req.cookies;

        return await TokenModel.deleteOne({ refreshToken });
      } catch (error: any) {
        throw new ApolloError(error.message, "400");
      }
    },
  },
};
