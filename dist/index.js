"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const secrets_1 = require("./secrets");
const index_1 = __importDefault(require("./routes/index"));
const swagger_1 = __importDefault(require("./swagger"));
const lfeCheck_1 = require("./routes/lfeCheck");
var cors = require('cors');
let app = (0, express_1.default)();
// ✅ Body parsing middleware should be first
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ✅ CORS should come after body parsing
app.use(cors());
// ✅ Setup Swagger documentation
(0, swagger_1.default)(app);
// ✅ Register all routes
app.use("/", lfeCheck_1.lifeCheck);
app.use("/api", index_1.default);
app.listen(secrets_1.PORT, () => console.log("The server is live"));
