import { UserActions, UserState, LOAD_USER, CLEAR_USER } from "./types.ts";

const initialUserState: UserState = {
    data: null
};

export const userReducer = (state = initialUserState, action: UserActions): UserState => {
    switch (action.type) {
        case LOAD_USER: {
            return {
                ...state,
                data: action.payload.data
            };
        }
        case CLEAR_USER: {
            return {
                ...state,
                data: null
            };
        }
        default: {
            return state;
        }
    }
};