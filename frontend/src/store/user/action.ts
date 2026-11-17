import { User, LOAD_USER, CLEAR_USER, LoadUserAction, ClearUserAction } from "./types.ts";

export const loadUserAction = (data: User): LoadUserAction => {
    return {
        type: LOAD_USER,
        payload: { data }
    };
};

export const clearUserAction = (): ClearUserAction => {
    return {
        type: CLEAR_USER
    };
};