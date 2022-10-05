import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer, AuthenticationError } from "apollo-server-express";

import * as AppModels from "./src/models";
import { IContext } from "./src/types";
import { connect } from "./helpers/connect";
import { authMiddleware } from "./middlewares/authMiddleware";
import { corsOptions, formatError, plugins, schema } from "./config";

dotenv.config();

const PORT = process.env.PORT ?? 5001;
const app = express();

app.disable("x-powered-by");
app.use(authMiddleware);

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(cookieParser());

const publicOperations: string[] = ["LoginUser", "RefreshUser", "RegisterUser", "ActivateUser"];

const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }: IContext) => {
    const { isAuth, user } = req;

    const isPublicOperations = publicOperations.includes(req.body.operationName);

    if (!isPublicOperations && !isAuth) {
      throw new AuthenticationError("JWT is not valid please sign up");
    }

    return {
      req,
      res,
      isAuth,
      user,
      ...AppModels,
    };
  },
  formatError,
  plugins,
});

const startApp = async () => {
  try {
    await connect();
    await apolloServer.start();
    apolloServer.applyMiddleware({
      app,
      path: "/graphql",
      cors: false,
    });

    app.listen(PORT, () => console.log(`🚀 server has been started on port ${PORT}`));
  } catch (error: any) {
    console.log(error.message);
  }
};

startApp();
