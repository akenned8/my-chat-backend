import app from "./app";
import { corsOptions } from "./app";
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { saveAndBroadcastMessage } from './controllers/messageController';

const server = http.createServer(app);

const io = new Server(server, {
    cors: corsOptions
});

app.use(cors(corsOptions));

interface ChatSocket extends Socket {
    sessionId?: string;
    userId?: string;
    username?: string;
}

// Handle socket connections
io.on('connection', (socket: ChatSocket) => {
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
    socket.on('chat message', async (content: string) => {
        if (!socket.sessionId || !socket.userId || !socket.username) {
            return;
        }

        try {
            await saveAndBroadcastMessage(
                io,
                socket.sessionId,
                socket.userId,
                socket.username,
                content
            );
        } catch (error) {
            socket.emit('error', 'Failed to save message');
        }
    });

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

server.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;