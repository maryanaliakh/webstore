import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import type {RootState} from "../../store";
import {ProductCard} from "./ProductCard";
import {Action, ThunkDispatch} from "@reduxjs/toolkit";
import * as action from "../../store/product/action.ts";
import {fetchProductsThunk} from "../../thunks/product.ts";
import {useEffect} from "react";

type ProductsCarouselOwnProps = {
    page?: string;
}

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    discounts: state.discount.data,
    favorites: state.productFavorites.ids,
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchProducts: () => dispatch(fetchProductsThunk),
    onToggleFavorite: (productId: number) => dispatch(action.toggleProductFavorites(productId)),
});

type ProductsCarouselProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    ProductsCarouselOwnProps;

const ProductsCarousel = ({ products, discounts, favorites, onToggleFavorite, onFetchProducts, page }: ProductsCarouselProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        onFetchProducts()
    }, [onFetchProducts]);

    return (
        <div className={`position-relative pt-5 ${page === "home" ? "bg-black text-white" : "bg-white text-black"}`}>
            <div className="fs-5 fw-bold small px-4 mb-3 ">COMPLETE YOUR LOOK</div>
            <div
                className="d-flex flex-nowrap overflow-auto gap-1"
                style={{
                    scrollbarWidth: "none",
                    scrollBehavior: "smooth",
                }}
            >
                {products.map(product => (
                    <div
                        key={product.id}
                        className="flex-shrink-0"
                        style={{ width: "clamp(220px, 22vw, 380px)" }}
                    >
                        <ProductCard
                            product={product}
                            favorite={favorites.includes(product.id)}
                            discounts={discounts}
                            onToggleFavorite={onToggleFavorite}
                            onClick={() => navigate(`/product/${product.id}`)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductsCarouselComponent = connect(mapStateToProps, mapDispatchToProps)(ProductsCarousel);
