import type { RootState } from "../store";
import { createSelector } from "reselect";

export const userSelector = (state: RootState) => state.user.data;

export const userIdSelector = createSelector(userSelector, user => user?.id);
export const userNameSelector = createSelector(userSelector, user => user?.name);
export const userEmailSelector = createSelector(userSelector, user => user?.email);
export const userPhoneSelector = createSelector(userSelector, user => user?.phone);
export const userRoleSelector = createSelector(userSelector, user => user?.role);
export const isUserLoggedInSelector = createSelector(userSelector, user => user !== null);