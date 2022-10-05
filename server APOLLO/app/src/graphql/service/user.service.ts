import { pick } from "lodash";

export const serializeUser = (user: any) =>
  pick(user, ["id", "email", "activationLink", "isActivated"]);
