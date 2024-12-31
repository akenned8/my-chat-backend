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
exports.joinSession = exports.createSession = void 0;
const uuid_1 = require("uuid");
const dynamodb_1 = require("../services/dynamodb");
const createSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionId = (0, uuid_1.v4)();
        const userId = req.body.userId;
        const session = {
            sessionId,
            createdAt: Date.now(),
            creatorId: userId,
            active: true,
            ttl: Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        };
        yield dynamodb_1.dynamoDB.put({
            TableName: 'ChatSessions',
            Item: session,
            ConditionExpression: 'attribute_not_exists(sessionId)'
        }).promise();
        res.json({ sessionId });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create session' });
    }
});
exports.createSession = createSession;
const joinSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sessionId } = req.params;
        const { userId, username } = req.body;
        const session = yield dynamodb_1.dynamoDB.get({
            TableName: 'ChatSessions',
            Key: { sessionId }
        }).promise();
        if (!session.Item || !session.Item.active) {
            res.status(404).json({ error: 'Session not found or inactive' });
            return;
        }
        yield dynamodb_1.dynamoDB.put({
            TableName: 'SessionUsers',
            Item: {
                sessionId,
                userId,
                username,
                lastSeen: Date.now()
            }
        }).promise();
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to join session' });
    }
});
exports.joinSession = joinSession;
//# sourceMappingURL=sessionController.js.map