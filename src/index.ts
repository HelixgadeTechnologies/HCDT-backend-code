import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouters from "./routes/index";
import setupSwagger from './swagger';
var cors = require('cors')
let app: Express = express();

// ✅ Body parsing middleware should be first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS should come after body parsing
app.use(cors());

// ✅ Setup Swagger documentation
setupSwagger(app);

// ✅ Register all routes
app.use("/api", rootRouters);

app.listen(PORT, () => console.log("The server is live"));