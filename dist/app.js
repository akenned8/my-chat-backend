"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const localconfig_1 = require("./config/localconfig");
const qaconfig_1 = require("./config/qaconfig");
const prodconfig_1 = require("./config/prodconfig");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const healthController = __importStar(require("./controllers/healthController"));
const messageController = __importStar(require("./controllers/messageController"));
const sessionController = __importStar(require("./controllers/sessionController"));
// import * as sessionUserController from "./controllers/sessionUserController";
const env = process.env.NODE_ENV || "LCL";
let config;
switch (env) {
    case "PROD":
        exports.config = config = prodconfig_1.prodconfig;
        break;
    case "QA":
        exports.config = config = qaconfig_1.qaconfig;
        break;
    case "LCL":
        exports.config = config = localconfig_1.localconfig;
        break;
    default:
        exports.config = config = localconfig_1.localconfig;
}
dotenv_1.default.config();
// Configure AWS SDK
aws_sdk_1.default.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
// CORS configuration
const corsOptions = {
    origin: "http://localhost:3000", // Ensure this matches your frontend's URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // Allow cookies or authentication headers
};
app.use((0, cors_1.default)(corsOptions));
app.set("port", process.env.PORT || 5000);
/* Routes */
//Health check route
app.get("/health", healthController.getHealth);
// Session routes
app.post("/sessions", sessionController.createSession);
app.post("/sessions/:sessionId/join", sessionController.joinSession);
// Message routes
app.get("/sessions/:sessionId/messages", messageController.getSessionMessages);
exports.default = app;
//# sourceMappingURL=app.js.map