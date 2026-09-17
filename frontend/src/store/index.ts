import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./product/reducer.ts";
import {createReduxHistoryContext} from "redux-first-history";
import {createBrowserHistory} from "history";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
})

export const rootReducer = combineReducers({
    product: productReducer,
    router: routerReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware)
})

export const history = createReduxHistory(store)
export type RootState = ReturnType<typeof rootReducer>


