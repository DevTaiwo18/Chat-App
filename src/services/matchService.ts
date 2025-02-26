import { PotentialMatch, MatchResponse, UserAction, MatchActionResponse } from '@/types/match';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
    constructor(public message: string, public statusCode?: number) {
        super(message);
    }
}

export const matchService = {
    async getPotentialMatches(): Promise<PotentialMatch[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/match/potential`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch potential matches', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async likeOrPassUser(targetUserId: string, action: 'like' | 'pass'): Promise<MatchActionResponse> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/match/action`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ targetUserId, action }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to process action', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async getMatches(): Promise<MatchResponse[]> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/match`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch matches', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    }
};