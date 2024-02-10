import { Request } from 'express';

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId?: number;
}

export interface RegisterUserRequest extends Request {
    body: UserData;
}

export interface TokenPayload {
    sub: string;
    role: string;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id: string;
    };
}

export interface AuthCookie {
    accessToken: string;
    refreshToken: string;
}

export interface ITenant {
    name: string;
    address: string;
}

export interface createTenantRequest extends Request {
    body: ITenant;
}

export interface createUserRequest extends Request {
    body: UserData;
}

export interface LimitedUserData {
    firstName: string;
    lastName: string;
    role: string;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}
