import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import { localconfig } from './config/localconfig';
import { qaconfig } from './config/qaconfig';
import { prodconfig } from './config/prodconfig';
import AWS from 'aws-sdk';


import * as healthController from "./controllers/healthController";
import * as messageController from "./controllers/messageController";
import * as sessionController from "./controllers/sessionController";
// import * as sessionUserController from "./controllers/sessionUserController";

const env = process.env.NODE_ENV || "LCL";
let config;

switch (env) {
    case "PROD":
        config = prodconfig;
        break;
    case "QA":
        config = qaconfig;
        break;
    case "LCL":
        config = localconfig;
        break;
    default:
        config = localconfig;
}
export { config };
dotenv.config();

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const app = express();
app.use(express.json());

// CORS configuration
export const corsOptions = {
    origin: ["http://localhost:3000", "http://my-chat-app-bucket.s3-website.localhost.localstack.cloud:4566"], // Ensure this matches your frontend's URL
    methods: ["*"]
};

app.use(cors(corsOptions));

app.set("port", process.env.PORT || 5000);

/* Routes */

//Health check route
app.get("/health", healthController.getHealth);

// Session routes
app.post("/sessions", sessionController.createSession);
app.post("/sessions/:sessionId/join", sessionController.joinSession);

// Message routes
app.get("/sessions/:sessionId/messages", messageController.getSessionMessages);

export default app;