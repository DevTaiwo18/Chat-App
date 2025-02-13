export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name?: string;
}

export interface AuthResponse {
    token: string;
    message?: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    isEmailVerified: boolean;
}