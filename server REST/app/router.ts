import express from "express";
import * as Controller from "./modules/planes/controller/plain.controller";
import * as AuthController from "./modules/auth/controller/user.controller";
import { body } from "express-validator";
import { authMiddleware } from "./middlewares/authMiddleware";

export const router = express.Router();

router.get("/planes", authMiddleware, Controller.getAllPlanes);
router.get("/planes/:id", authMiddleware, Controller.getOnePlane);
router.post("/planes", authMiddleware, Controller.createPlane);
router.patch("/planes/:id", authMiddleware, Controller.updatePlane);
router.delete("/planes/:id", authMiddleware, Controller.deletePlane);

router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 20 }),
  AuthController.registration
);
router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.get("/activate/:link", AuthController.activate);
router.get("/refresh", AuthController.refresh);
router.get("/users", authMiddleware, AuthController.getUsers);

// import { Express } from "express";
// import * as planesController from "./modules/planes/controller/plain.controller";
// import * as authController from "./modules/auth/controller/user.controller";

// export const routes = (app: Express) => {
//   app.get("/api/planes", planesController.getAllPlanes);
//   app.get("/api/planes/:id", planesController.getOnePlane);
//   app.post("/api/planes", planesController.createPlane);
//   app.patch("/api/planes/:id", planesController.updatePlane);
//   app.delete("/api/planes/:id", planesController.deletePlane);

//   app.post("/api/registration", authController.registration);
//   app.post("/api/login", authController.login);
//   app.post("/api/logout", authController.logout);
//   app.get("/api/activate/:link", authController.activate);
//   app.get("/api/refresh", authController.refresh);
//   app.get("/api/users", authController.getUsers);
// };
