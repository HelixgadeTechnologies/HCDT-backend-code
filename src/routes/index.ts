import { Router } from "express"
import authRoutes from "./authroute"

const rootRouters: Router = Router();

rootRouters.use("/auth", authRoutes);

export default rootRouters;