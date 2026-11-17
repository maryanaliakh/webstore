import * as api from "../api/password.ts";

export const forgotPasswordThunk = (email: string) => async () => {
    return await api.forgotPassword(email);
};