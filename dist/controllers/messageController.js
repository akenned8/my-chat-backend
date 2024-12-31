"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionMessages = exports.saveAndBroadcastMessage = void 0;
const uuid_1 = require("uuid");
const dynamodb_1 = require("../services/dynamodb");
const saveAndBroadcastMessage = (io, sessionId, userId, username, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = {
            sessionId,
            messageId: (0, uuid_1.v4)(),
            userId,
            username,
            content,
            timestamp: Date.now()
        };
        yield dynamodb_1.dynamoDB.put({
            TableName: 'ChatMessages',
            Item: message
        }).promise();
        // Update user's last seen timestamp
        yield dynamodb_1.dynamoDB.put({
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
    }
    catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
});
exports.saveAndBroadcastMessage = saveAndBroadcastMessage;
const getSessionMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const { lastMessageId } = req.query;
        const limit = 50;
        const params = {
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
        const result = yield dynamodb_1.dynamoDB.query(params).promise();
        res.json(result.Items);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
exports.getSessionMessages = getSessionMessages;
//# sourceMappingURL=messageController.js.map