// Trigger restart
import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import rootRoutes from "./routes/index";
import setupSwagger from './swagger';
import { lifeCheck } from "./routes/lfeCheck";
import authenticateToken from "./middlewares/auth.middleware";
import cors from 'cors';
let app: Express = express();

// Explicit CORS config — required for Heroku proxy and Swagger UI
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: false,
    optionsSuccessStatus: 200, // Some browsers (IE11) choke on 204
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

// Trust proxy (for Heroku or reverse proxies)
app.set("trust proxy", 1);

// Body parsing middleware (AFTER CORS)
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded payload limit

// Setup Swagger (AFTER routes, so it doesn't interfere)
setupSwagger(app);

// Apply JWT middleware for all protected POST requests
app.use((req, res, next) => {
    // Define routes to exclude from authentication
    const excludedRoutes = [
        "/api/auth/signIn",
        "/api/auth/signUp",
        "/api/setting/addDRA",
        "/api/setting/registerUser",
        "/api/conflict/create",
        "/api/average-community-satisfaction/create",
        "/api/economic-impact/create"
    ];

    if (excludedRoutes.includes(req.path)) {
        return next(); // Skip authentication for these routes
    }

    authenticateToken(req, res, next); // Apply middleware for all other routes
});


// Register routes
app.use("/api", rootRoutes);
app.use("/", lifeCheck);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

app.listen(PORT, () => console.log("The server is live"));