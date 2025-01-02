import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const dynamoConfig = {
    region: process.env.AWS_REGION || 'us-east-1',
    endpoint: process.env.DB_URI, // Use this for LocalStack
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
    },
    httpOptions: {
        timeout: 4000
    }
};

export const dynamoDB = new AWS.DynamoDB.DocumentClient(dynamoConfig);