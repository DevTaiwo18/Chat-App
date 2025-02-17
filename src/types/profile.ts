export interface Location {
    type: string;
    coordinates: number[];
}

export interface AgeRange {
    min: number;
    max: number;
}

export interface Preferences {
    ageRange: AgeRange;
    gender: ('male' | 'female' | 'other')[];
    maxDistance: number;
}

export interface Profile {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    bio: string;
    interests: string[];
    location?: Location;
    preferences: Preferences;
    profilePicture?: string;
}

export interface ProfileResponse extends Profile {
    _id: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface FormData {
    name: string;
    age: string; 
    gender: string; 
    bio: string;
    interests: string[];
    preferences: {
        ageRange: {
            min: number;
            max: number;
        };
        gender: string[]; 
        maxDistance: number;
    }
}

export interface ProfileData {
    name: string;
    age: number; 
    gender: 'male' | 'female' | 'other';
    bio: string;
    interests: string[];
    preferences: {
        ageRange: {
            min: number;
            max: number;
        };
        gender: ('male' | 'female' | 'other')[];
        maxDistance: number;
    }
}

export interface ProfileResponse extends ProfileData {
    _id: string;
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Location {
    type: string;
    coordinates: number[];
}