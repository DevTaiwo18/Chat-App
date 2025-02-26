import { Profile, ProfileResponse } from '@/types/profile';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://chat-app-api-4srj.onrender.com/api';

class ApiError extends Error {
    constructor(public message: string, public statusCode?: number) {
        super(message);
    }
}

export const profileService = {
    async createProfile(profileData: Profile): Promise<ProfileResponse> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/profile/me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            console.log(profileData)

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to create profile', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async getProfile(): Promise<ProfileResponse> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/profile/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to fetch profile', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async updateProfile(profileData: Partial<Profile>): Promise<ProfileResponse> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        try {
            const response = await fetch(`${BASE_URL}/profile/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(profileData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to update profile', response.status);
            }

            return response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Network error occurred');
        }
    },

    async uploadProfilePicture(file: File): Promise<{ profilePicture: string }> {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new ApiError('Authentication required');
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            throw new ApiError('Only image files are allowed');
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            throw new ApiError('File size exceeds 5MB limit');
        }

        try {
            const formData = new FormData();
            formData.append('picture', file);

            const response = await fetch(`${BASE_URL}/profile/me/picture`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Failed to upload profile picture', response.status);
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