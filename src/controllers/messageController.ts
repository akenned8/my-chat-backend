import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../types/customTypes';
import { dynamoDB } from '../services/dynamodb';


export const saveAndBroadcastMessage = async (
    io: Server,
    sessionId: string,
    userId: string,
    username: string,
    content: string
) => {
    try {
        const message: ChatMessage = {
            sessionId,
            messageId: uuidv4(),
            userId,
            username,
            content,
            timestamp: Date.now()
        };

        await dynamoDB.put({
            TableName: 'ChatMessages',
            Item: message
        }).promise();

        // Update user's last seen timestamp
        await dynamoDB.put({
            TableName: 'SessionUsers',
            Item: {
                sessionId,
                userId,
                username,
                lastSeen: Date.now()
            }
        }).promise();

        // Broadcast only to users in the same session
        io.to(sessionId).emit('chat message', message);

        return message;
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
};

export const getSessionMessages = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.params;
        const { lastMessageId } = req.query;
        const limit = 50;

        const params: AWS.DynamoDB.DocumentClient.QueryInput = {
            TableName: 'ChatMessages',
            KeyConditionExpression: 'sessionId = :sid',
            ExpressionAttributeValues: {
                ':sid': sessionId
            },
            Limit: limit,
            ScanIndexForward: false
        };

        if (lastMessageId) {
            params.ExclusiveStartKey = {
                sessionId,
                messageId: lastMessageId
            };
        }

        const result = await dynamoDB.query(params).promise();
        res.json(result.Items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};