import type {RootState} from "../store";
import * as selector from "../selectors/product.ts";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import * as thunk from "../thunks/product.ts";
import {fetchProductFilterOptionsThunk} from "../thunks/product.ts";
import {connect} from "react-redux";
import {useEffect} from "react";
import Header from "../components/Header.tsx";
import {FiltersComponent} from "../components/filter/Filters.tsx";
import * as action from "../store/product/action";
import Footer from "../components/Footer.tsx";
import {usePanels} from "../components/context/panel/usePanels.ts";
import {fetchDiscountsThunk} from "../thunks/discount.ts";
import {modifyUrlThunk} from "../thunks/common.ts";
import {ProductsHeaderComponent} from "../components/product/ProductsHeader.tsx";
import * as _ from "lodash";
import {ProductsList} from "../components/product/ProductList.tsx";
import {useNavigate} from "react-router-dom";


const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    filters: selector.productFilterSelector(state),
    favorites: state.productFavorites.ids,
    discounts: state.discount.data
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({ //action creator bindings
    onFetch: () => dispatch(thunk.fetchProductsThunk()),
    onToggleFavorite: (productId: number) => dispatch(action.toggleProductFavorites(productId)),
    onFetchFilterOptions: () => dispatch(fetchProductFilterOptionsThunk()),
    onFetchDiscounts: () => dispatch(fetchDiscountsThunk()),
    onUpdate: (key: string, value: string | string[]) => dispatch(modifyUrlThunk(key, value)),
})

type ProductsProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

function Products({products, filters, favorites, discounts, onFetch, onToggleFavorite, onFetchFilterOptions, onFetchDiscounts}: ProductsProps) {
    const { activePanel, togglePanel, closePanel } = usePanels();
    const navigate = useNavigate();

    useEffect(() => {
        onFetchFilterOptions();
    }, [onFetchFilterOptions]);

    useEffect(() => {
        onFetch();
    }, [filters, onFetch]);

    useEffect(() => {
        onFetchDiscounts();
    }, [onFetchDiscounts]);

    return (
        <>
            <Header />

            <main className="py-5">

                <ProductsHeaderComponent onToggleFilters={() => togglePanel("filters")} />

                <FiltersComponent open={activePanel === "filters"} onClose={closePanel} />


                {/* RESULTS */}
                {products.length > 0 ? (
                    <div className="row g-1 pt-1 mx-0">

                        <ProductsList
                            products={products}
                            favorites={favorites}
                            discounts={discounts}
                            onToggleFavorite={onToggleFavorite}
                            onProductClick={productId => navigate(`/product/${productId}`)}
                        />
                    </div>
                ) : (
                    <p className="text-muted px-4 d-flex  justify-content-center align-items-center text-center"
                       style={{minHeight: "500px"}}>
                        <small>
                            No products found. Try searching for something else.
                        </small>
                    </p>
                )}

            </main>

            <Footer />
        </>
    );
}

export const ProductsContainer = connect(mapStateToProps, mapDispatchToProps)(Products)


