import express from "express";

export const router = express.Router();

router.post("/registration");
router.post("/login");
router.post("/logout");
router.get("/activate/:link");
router.get("/refresh");
router.get("/users");
