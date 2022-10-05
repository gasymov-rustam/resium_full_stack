import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connect } from "./helpers/connect";
import { log } from "./helpers/logger";
import { router } from "./router";
import { errorHandler } from "./middlewares/errorHandler";

dotenv.config();

const PORT = process.env.PORT ?? 5001;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
    // origin: "*"
  })
);
app.use("/api", router);
app.use(errorHandler);

app.listen(PORT, async () => {
  try {
    log.info(`server has been started on port ${PORT}`);

    await connect();

    // routes(app);
  } catch (error) {
    log.error(error);
  }
});
