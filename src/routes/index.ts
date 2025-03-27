import { Router } from "express"
import authRoutes from "./authroute"
import trustRoutes from "./trustRoute";
import projectRouter from "./projectRoute";
import conflictRouter from "./conflictRoute";
import averageCommunitySatisfactionRouter from "./averageCommunitySatisfactionRoute";
import economicImpactRouter from "./economicImpactRoute";
import settingsRoute from "./settingsRoute";
import uploadRoutes from "./uploadRoute";

const rootRoutes: Router = Router();


rootRoutes.use("/auth", authRoutes);
rootRoutes.use("/setting", settingsRoute);
rootRoutes.use("/trust", trustRoutes);
rootRoutes.use("/project", projectRouter);
rootRoutes.use("/conflict", conflictRouter);
rootRoutes.use("/average-community-satisfaction", averageCommunitySatisfactionRouter);
rootRoutes.use("/economic-impact", economicImpactRouter);
rootRoutes.use("/upload", uploadRoutes);



export default rootRoutes;
