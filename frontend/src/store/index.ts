import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {productDetailsReducer, productFilterOptionsReducer, productReducer, productFavoritesReducer, modalProductDetailsReducer} from "./product/reducer.ts";
import {cartReducer} from "./cart/reducer.ts";
import {createReduxHistoryContext} from "redux-first-history";
import {createBrowserHistory} from "history";
import {collectionReducer, latestCollectionReducer} from "./collection/reducer.ts";
import {categoryReducer} from "./category/reducer.ts";
import {discountReducer} from "./discount/reducer.ts";
import { userReducer } from "./user/reducer.ts";
import {shippingReducer} from "./shipping/reducer.ts";
import {paymentReducer} from "./payment/reducer.ts";
import {orderReducer} from "./order/reducer.ts";
import {addressReducer} from "./address/reducer.ts";
import type { Store } from "redux";

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
    history: createBrowserHistory(),
})

export const rootReducer = combineReducers({
    router: routerReducer,
    product: productReducer,
    productFilterOptions: productFilterOptionsReducer,
    productDetails: productDetailsReducer,
    productFavorites: productFavoritesReducer,
    modalProductDetails: modalProductDetailsReducer,
    cart: cartReducer,
    collection: collectionReducer,
    latestCollection: latestCollectionReducer,
    category: categoryReducer,
    discount: discountReducer,
    shipping: shippingReducer,
    payment: paymentReducer,
    user: userReducer,
    order: orderReducer,
    address: addressReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(routerMiddleware)
})

store.subscribe(() => {
    localStorage.setItem("cart", JSON.stringify(store.getState().cart.items));
});

export const history = createReduxHistory(store as Store);
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch;


