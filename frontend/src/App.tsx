import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {SingleProduct} from './pages/SingleProduct.tsx'
import {SearchResultContainer} from "./components/SearchResult.tsx";
import {Provider} from "react-redux";
import {store, history} from "./store";
import {ProductsContainer} from "./pages/Products.tsx";
import {HistoryRouter} from "redux-first-history/rr6";
function App() {
  return (
      <Provider store={store}>
        <HistoryRouter history={history}>
          <Routes>
              <Route path="/product/:id" element={<SingleProduct />} />
              <Route path="/search" element={<SearchResultContainer />} />
              <Route path="/products" element={<ProductsContainer />} />
          </Routes>
        </HistoryRouter>
      </Provider>
  )
}

export default App
