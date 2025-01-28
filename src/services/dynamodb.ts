import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const dynamoConfig: AWS.DynamoDB.Types.ClientConfiguration = {
    region: process.env.AWS_REGION || 'us-east-1',
    httpOptions: {
        timeout: 4000
    }
};

if (process.env.NODE_ENV === 'LCL') {
    dynamoConfig.endpoint = process.env.DB_URI;
    dynamoConfig.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test'
    }
}

export const dynamoDB = new AWS.DynamoDB.DocumentClient(dynamoConfig);