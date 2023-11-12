import { Router } from "express";
import { registration, login, getMe } from "../controllers/auth.js";
import { checkAuth } from "../utils/checkAuth.js";

const router = new Router();

// Registration
router.post("/registration", registration);

// Login
router.post("/login", login);

// Get Me
router.post("/getme", checkAuth, getMe);

export default router;
