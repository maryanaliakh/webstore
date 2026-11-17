import Header from "../components/Header.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import type {RootState} from "../store";
import {connect} from "react-redux";
import type {ThunkDispatch} from "redux-thunk";
import type {Action} from "redux";
import * as thunk from "../thunks/product.ts";
import * as action from "../store/product/action";
import Footer from "../components/Footer.tsx";
import {AddToBagModalContainer} from "../components/product/AddProductToBag.tsx";
import { ProductsList } from "../components/product/ProductList.tsx";
import {fetchDiscountsThunk} from "../thunks/discount.ts";

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    favorites: state.productFavorites.ids,
    discounts: state.discount.data
})

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetch: () => dispatch(thunk.fetchProductsThunk()),
    onToggleFavorite: (productId: number) => dispatch(action.toggleProductFavorites(productId)),
    onFetchDiscounts: () => dispatch(fetchDiscountsThunk()),
})

type FavoritesProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

function Favorites({products, favorites,discounts, onFetch, onToggleFavorite, onFetchDiscounts}: FavoritesProps) {
    const [productId, setProductId] = useState<number | null>(null);
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Favorites"
    }, [])

    useEffect(() => {
        onFetch()
    }, [])

    useEffect(() => {
        onFetchDiscounts()
    }, [onFetchDiscounts])

    const favoriteProducts = products.filter(product =>
        favorites.includes(product.id)
    )

    return (
            <div className="d-flex flex-column min-vh-100">
                <Header />

                <main className="container-fluid px-0 pb-4 flex-grow-1">

                    <div className="d-flex justify-content-end align-items-center py-3 px-4">
                        <div className="btn p-0 border-0" style={{cursor: "default"}}>
                            <small>{favoriteProducts.length} PRODUCTS</small>
                        </div>
                    </div>

                    {favoriteProducts.length > 0 ? (
                        <ProductsList
                            products={favoriteProducts}
                            favorites={favorites}
                            discounts={discounts}
                            onToggleFavorite={onToggleFavorite}
                            onProductClick={productId => navigate(`/product/${productId}`)}
                            onAddToBag={productId => setProductId(productId)}
                            showAddToBag
                        />
                    ) : (
                        <div className="d-flex flex-column justify-content-center align-items-center text-center"
                             style={{minHeight: "500px"}}>

                            <p className="text-muted">
                                <small>
                                Want to add products to your Favorites? It’s easy – just click the heart icon on the product.
                                </small>
                            </p>

                            <button
                                className="btn btn-light rounded-0 btn-sm px-3 py-3"
                                onClick={() => navigate("/products")}
                            >
                                EXPLORE BUBBLE
                            </button>
                        </div>
                    )}
                </main>

                <Footer />

                <AddToBagModalContainer
                    productId={productId}
                    onClose={() => setProductId(null)}
                />
            </div>
    )
}

export const ProductsFavoriteContainer = connect(mapStateToProps, mapDispatchToProps)(Favorites)