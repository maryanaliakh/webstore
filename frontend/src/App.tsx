import './App.css'
import {Routes, Route} from "react-router-dom";
import {ProductDetailsContainer} from './pages/ProductDetails.tsx'
import {Provider} from "react-redux";
import {store, history} from "./store";
import {ProductsContainer} from "./pages/Products.tsx";
import {HistoryRouter} from "redux-first-history/rr6";
import {ProductsFavoriteContainer} from "./pages/Favorites.tsx";
import {CartContainer} from "./pages/Cart.tsx";
import {HomeContainer} from "./pages/Home.tsx";
import UserProvider from "./components/auth/UserProvider.tsx";
import GoogleCallback from "./pages/auth/GoogleCallback";
import {OrderContainer} from "./pages/Order.tsx";
import {OrderSuccessContainer} from "./pages/OrderSuccess.tsx";
import {AccountContainer} from "./pages/Account.tsx";
function App() {
    return (
        <Provider store={store}>
            <UserProvider />
            <HistoryRouter history={history}>
                <Routes>
                    <Route path="/auth/google/callback" element={<GoogleCallback />} />
                    <Route path="/product/:id" element={<ProductDetailsContainer />} />
                    <Route path="/products" element={<ProductsContainer />} />
                    <Route path="/favorites" element={<ProductsFavoriteContainer />} />
                    <Route path="/cart" element={<CartContainer />} />
                    <Route path="/checkout" element={<OrderContainer />} />
                    <Route path="/order-success" element={<OrderSuccessContainer />} />
                    <Route path="/" element={<HomeContainer />} />
                    <Route path="/account" element={<AccountContainer/>}/>
                </Routes>
            </HistoryRouter>
        </Provider>
    );
}

export default App;