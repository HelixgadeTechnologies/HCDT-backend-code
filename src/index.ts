import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouters from "./routes/index";
let app: Express = express();

app.use("/api", rootRouters)


app.listen(PORT, () => console.log("The server is live"));