import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRouters from "./routes/index";
var cors = require('cors')

let app: Express = express();

// Allow all origins (not recommended for production)
app.use(cors());

// app.use(
//     cors({
//       origin: "http://your-frontend.com", // Replace with your frontend URL
//       methods: ["GET", "POST", "PUT", "DELETE"],
//       allowedHeaders: ["Content-Type", "Authorization"],
//     })
//   );

app.use("/api", rootRouters)


app.listen(PORT, () => console.log("The server is live"));