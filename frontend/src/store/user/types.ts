export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    newsletter_consent: boolean;
}

export interface UserState {
    data: User | null;
}

export const LOAD_USER = "USER/LOAD";
export const CLEAR_USER = "USER/CLEAR";

export interface LoadUserAction {
    type: typeof LOAD_USER;
    payload: {
        data: User;
    };
}

export interface ClearUserAction {
    type: typeof CLEAR_USER;
}

export type UserActions = LoadUserAction | ClearUserAction;