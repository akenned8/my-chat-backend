"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamoDB = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dynamoConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DB_URI, // Use this for LocalStack
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
    }
};
exports.dynamoDB = new aws_sdk_1.default.DynamoDB.DocumentClient(dynamoConfig);
//# sourceMappingURL=dynamodb.js.map