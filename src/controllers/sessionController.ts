import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession } from '../types/customTypes';
import { dynamoDB } from '../services/dynamodb';

export const createSession = async (req: Request, res: Response) => {
    try {
        const sessionId = uuidv4();
        const userId = req.body.userId;

        const session: ChatSession = {
            sessionId,
            createdAt: Date.now(),
            creatorId: userId,
            active: true,
            ttl: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };

        await dynamoDB.put({
            TableName: 'ChatSessions',
            Item: session,
            ConditionExpression: 'attribute_not_exists(sessionId)'
        }).promise();

        res.json({ sessionId });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
};

export const joinSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { sessionId } = req.params;
        const { userId, username } = req.body;

        const session = await dynamoDB.get({
            TableName: 'ChatSessions',
            Key: { sessionId }
        }).promise();

        if (!session.Item || !session.Item.active) {
            res.status(404).json({ error: 'Session not found or inactive' });
            return;
        }

        await dynamoDB.put({
            TableName: 'SessionUsers',
            Item: {
                sessionId,
                userId,
                username,
                lastSeen: Date.now()
            }
        }).promise();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to join session' });
    }
};
