export interface PotentialMatch {
    _id: string;
    name?: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    location?: {
        type: string;
        coordinates: number[];
    };
    profilePicture?: string;
    bio?: string;
    interests: string[];
}

export interface MatchUser {
    _id: string;
    name?: string;
    profilePicture?: string;
}

export interface MatchResponse {
    matchId: string;
    user: MatchUser;
    createdAt: string;
}

export interface UserAction {
    targetUserId: string;
    action: 'like' | 'pass';
}

export interface MatchActionResponse {
    message: string;
    isMatch: boolean;
}