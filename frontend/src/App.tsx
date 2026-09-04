import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {SingleProduct} from './pages/SingleProduct.tsx'
import {SearchResultContainer} from "./components/SearchResult.tsx";
import {Provider} from "react-redux";
import {store} from "../store";
import {ProductsContainer} from "./pages/Products.tsx";
function App() {
  return (
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
              <Route path="/product/:id" element={<SingleProduct />} />
              <Route path="/search" element={<SearchResultContainer />} />
              <Route path="/products" element={<ProductsContainer />} />
          </Routes>
        </BrowserRouter>
      </Provider>
  )
}

export default App
