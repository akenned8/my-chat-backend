// TypeScript types for our entities
export interface ChatSession {
    sessionId: string;        // Partition key
    createdAt: number;        // Sort key - timestamp
    creatorId: string;        // ID of user who created the session
    active: boolean;          // Whether session is still active
    ttl: number;             // Time-to-live for session cleanup
}

export interface ChatMessage {
    sessionId: string;        // Partition key
    messageId: string;        // Sort key - UUID
    userId: string;          // ID of message sender
    username: string;        // Display name of sender
    content: string;         // Message content
    timestamp: number;       // When message was sent
}

export interface SessionUser {
    sessionId: string;       // Partition key
    userId: string;         // Sort key
    username: string;       // Display name in chat
    lastSeen: number;       // Last activity timestamp
}