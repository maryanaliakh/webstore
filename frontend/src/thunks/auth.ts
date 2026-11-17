import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import * as api from "../api/user.ts";
import * as action from "../store/user/action.ts";

interface CreateUserData {
    name: string;
    email: string;
    password: string;
    phone: string;
    keepSignedIn: boolean;
    newsletterConsent: boolean;
    termsAccepted: boolean;
}

export const createUserThunk = (data: CreateUserData) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const user = await api.createUser(data);

        dispatch(action.loadUserAction(user));

        return user;
    };
};

export const loginUserThunk = (data: {
    email: string;
    password: string;
    rememberMe: boolean;
}) => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        const user = await api.loginUser(data);

        dispatch(action.loadUserAction(user));

        return user;
    };
};

export const getCurrentUserThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        try {
            const user = await api.getCurrentUser();

            dispatch(action.loadUserAction(user));

            return user;
        } catch {
            dispatch(action.clearUserAction());

            return null;
        }
    };
};

export const logoutUserThunk = () => {
    return async (dispatch: ThunkDispatch<RootState, void, Action>) => {
        await api.logoutUser();

        dispatch(action.clearUserAction());
    };
};