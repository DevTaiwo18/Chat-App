import { ProfileResponse } from './profile';

export interface Message {
    _id: string;
    matchId: string;
    sender: string;
    receiver: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    updatedAt: string;
    pending?: boolean;
    failed?: boolean;
}

export interface Conversation {
    matchId: string;
    user: {
        _id: string;
        name?: string;
        profilePicture?: string;
    } | null;
    latestMessage: {
        _id: string;
        content: string;
        createdAt: string;
    } | null;
    unreadCount: number;
    updatedAt: string;
}

export interface MessageUser {
    _id: string;
    name?: string;
    profilePicture?: string;
}