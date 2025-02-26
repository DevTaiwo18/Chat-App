import { Message, Conversation } from '@/types/message';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
    constructor(public message: string, public statusCode?: number) {
        super(message);
    }
}

export const messageService = {
    async getConversations(): Promise<Conversation[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/messages/conversations`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch conversations', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async getMessages(matchId: string): Promise<Message[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/messages/match/${matchId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch messages', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async sendMessage(matchId: string, content: string): Promise<Message> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ matchId, content }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to send message', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async getUnreadCount(): Promise<{ unreadCount: number }> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/messages/unread`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch unread count', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },
};