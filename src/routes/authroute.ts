import { Router } from "express";
import { login, register, test } from "../controllers/authController";

const authRoutes: Router = Router();

authRoutes.get("/signIn", login);
authRoutes.get("/signUp", register);
authRoutes.get("/test", test);

export default authRoutes