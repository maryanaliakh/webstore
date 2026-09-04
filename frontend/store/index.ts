import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {productReducer} from "./product/reducer";
import {connectRouter, routerMiddleware} from "connected-react-router"
import {history} from '../src/common/history'

export const rootReducer = combineReducers({
    product: productReducer,
    router: connectRouter(history),
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat([
        routerMiddleware(history),
    ])
})

export type RootState = ReturnType<typeof rootReducer>


