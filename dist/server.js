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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const messageController_1 = require("./controllers/messageController");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000", //process.env.UI_ORIGIN,
        methods: ["*"]
    }
});
app_1.default.use((0, cors_1.default)());
// Handle socket connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // Handle joining a session
    socket.on('join session', ({ sessionId, userId, username }) => {
        socket.sessionId = sessionId;
        socket.userId = userId;
        socket.username = username;
        // Join the session room
        socket.join(sessionId);
        // Broadcast to others in the session that a new user joined
        socket.to(sessionId).emit('user joined', { userId, username });
    });
    // Listen for incoming chat messages
    socket.on('chat message', (content) => __awaiter(void 0, void 0, void 0, function* () {
        if (!socket.sessionId || !socket.userId || !socket.username) {
            return;
        }
        try {
            yield (0, messageController_1.saveAndBroadcastMessage)(io, socket.sessionId, socket.userId, socket.username, content);
        }
        catch (error) {
            socket.emit('error', 'Failed to save message');
        }
    }));
    // Handle disconnections
    socket.on('disconnect', () => {
        if (socket.sessionId) {
            socket.to(socket.sessionId).emit('user left', {
                userId: socket.userId,
                username: socket.username
            });
        }
        console.log('User disconnected:', socket.id);
    });
});
server.listen(app_1.default.get("port"), () => {
    console.log("  App is running at http://localhost:%d in %s mode", app_1.default.get("port"), app_1.default.get("env"));
    console.log("  Press CTRL-C to stop\n");
});
exports.default = server;
//# sourceMappingURL=server.js.map