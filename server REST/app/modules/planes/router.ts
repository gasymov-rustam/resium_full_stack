import express from "express";
import * as controller from "./controller/plain.controller";

export const router = express.Router();

router.get("/planes", controller.getAllPlanes);
router.get("/planes/:id", controller.getOnePlane);
router.post("/planes", controller.createPlane);
router.patch("/planes/:id", controller.updatePlane);
router.delete("/planes/:id", controller.deletePlane);
