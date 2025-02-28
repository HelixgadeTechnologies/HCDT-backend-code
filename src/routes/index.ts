import { Router } from "express"
import authRoutes from "./authroute"
import trustRoutes from "./trustRoute";

const rootRoutes: Router = Router();


rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/trust", trustRoutes);



export default rootRoutes;
