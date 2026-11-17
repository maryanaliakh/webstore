
import { useEffect, useState } from "react";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer";
import type { RootState } from "../store";
import { Action, ThunkDispatch } from "@reduxjs/toolkit";
import * as thunk from "../thunks/product.ts";
import { connect } from "react-redux";
import * as thunkCommon from "../thunks/common";
import * as _ from "lodash";
import * as action from "../store/product/action.ts";
import ShippingReturns from "../components/panels/ShippingReturns.tsx";
import { ProductsCarouselComponent } from "../components/product/ProductsCarousel.tsx";
import { usePanels } from "../components/context/panel/usePanels.ts";
import { fetchDiscountsThunk } from "../thunks/discount.ts";
import { AddToBagModalContainer } from "../components/product/AddProductToBag.tsx";
import { useNavigate } from "react-router-dom";
import { idSelector } from "../selectors/product.ts";

const mapStateToProps = (state: RootState) => ({
    productDetails: state.productDetails,
    products: state.product.data,
    discounts: state.discount.data,
    favorites: state.productFavorites.ids,
    productIdFromUrl: Number(idSelector(state))
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchProductDetails: (color?: string, productId?: number) => dispatch(thunk.fetchProductDetailsThunk(color, productId)),
    onUpdate: (key: string, value: string) => dispatch(thunkCommon.modifyUrlThunk(key, value)),
    onToggleFavorite: (productId: number) => dispatch(action.toggleProductFavorites(productId)),
    onFetchProducts: () => dispatch(thunk.fetchProductsThunk()),
    onFetchDiscounts: () => dispatch(fetchDiscountsThunk()),
});

type ProductDetailsProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function ProductDetails({ productDetails, products, discounts, favorites, productIdFromUrl, onFetchProductDetails, onUpdate, onToggleFavorite, onFetchProducts, onFetchDiscounts }: ProductDetailsProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [productId, setProductId] = useState<number | null>(null);
    const { activePanel, togglePanel, closePanel } = usePanels();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = productDetails.name ? productDetails.name : "BUBBLE";
    }, [productDetails.name]);

    useEffect(() => {
        if (!Number.isInteger(productIdFromUrl) || productIdFromUrl <= 0) return;

        onFetchProductDetails(undefined, productIdFromUrl);
        onFetchProducts();
    }, [productIdFromUrl]);

    useEffect(() => {
        onFetchDiscounts();
    }, []);

    useEffect(() => {
        if (productDetails.selectedColor) {
            onUpdate("color", productDetails.selectedColor);
        }

        setSelectedSize(productDetails.variants[0]?.size ?? null);
    }, [productDetails.selectedColor]);

    const product = products?.find(p => p.id === productDetails.id);

    const discount = product?.discount_id
        ? discounts?.find(d => d.id === product.discount_id)
        : undefined;

    const price = Number(productDetails.price ?? 0);

    const finalPrice = discount
        ? price * (1 - Number(discount.percentage) / 100)
        : price;

    return (
        <main>
            <Header />

            <div className="row g-0 align-items-stretch">
                <div className="col-lg-7">
                    <div className="d-flex flex-column">
                        {productDetails.images.map((image) => (
                            <img
                                key={image.id}
                                src={image.url}
                                alt={`${productDetails.name} ${image.color}`}
                                className="img-fluid w-100 d-block"
                            />
                        ))}
                    </div>
                </div>

                <div className="col-lg-5">
                    <div
                        className="px-4 px-xl-5 pt-4"
                        style={{
                            position: "sticky",
                            top: "100px",
                            alignSelf: "flex-start"
                        }}
                    >
                        <h6 className="mb-2 fw-semibold">{_.upperCase(productDetails.name)}</h6>

                        <div className="mb-2">
                            <small>{productDetails.subtitle}</small>
                        </div>

                        <div className="d-flex align-items-center gap-2 pb-4">
                            <span className={`fw-semibold small ${discount ? "bg-danger text-white px-1" : ""}`}>
                                {finalPrice.toFixed(2)} zł
                                {discount && (
                                    <span className="text-white ms-2">
                                        -{Number(discount.percentage)}%
                                    </span>
                                )}
                            </span>

                            {discount && (
                                <span className="fw-semibold text-secondary text-decoration-line-through small">
                                    {price.toFixed(2)} zł
                                </span>
                            )}
                        </div>

                        {/* COLORS */}
                        <div className="mb-4">
                            <div className="small mb-3">
                                {_.upperCase(productDetails.selectedColor)}
                            </div>

                            <div className="d-flex gap-3">
                                {productDetails.colors.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => {
                                            setSelectedSize(null);
                                            onFetchProductDetails(color, productIdFromUrl);
                                        }}
                                        className="p-0 border-0 bg-transparent"
                                        title={color}
                                    >
                                        <span
                                            style={{
                                                display: "block",
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "50%",
                                                backgroundColor: _.lowerCase(color),
                                                border: "1px solid #ccc",
                                                boxShadow: productDetails.selectedColor === color
                                                    ? "0 0 0 2px white, 0 0 0 3px black"
                                                    : "none"
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SIZES */}
                        <div className="mb-5">
                            <div className="small mb-2">SIZE</div>

                            <div className="d-flex gap-2">
                                {productDetails.variants.map((variant) => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        disabled={variant.stock === 0}
                                        onClick={() => setSelectedSize(variant.size)}
                                        className={`btn rounded-0 btn-sm px-3 py-2 ${
                                            selectedSize === variant.size ? "btn-dark" : "btn-light"
                                        }`}
                                    >
                                        {_.upperCase(variant.size)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="btn btn-dark w-100 mb-3 rounded-0 btn-sm px-3 py-3"
                            onClick={() => setProductId(productDetails.id)}
                        >
                            ADD TO BAG
                        </button>

                        <button
                            type="button"
                            className="btn btn-light w-100 mb-5 d-flex align-items-center justify-content-center rounded-0 btn-sm px-3 py-3"
                            onClick={(event) => {
                                event.stopPropagation();
                                onToggleFavorite(productDetails.id);
                                navigate("/favorites");
                            }}
                        >
                            <span className="d-flex align-items-center gap-2">
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
                                        fill={favorites.includes(productDetails.id) ? "#FF6B35" : "white"}
                                        stroke="black"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                ADD TO WISHLIST
                            </span>
                        </button>

                        {/* DESCRIPTION */}
                        <div className="border-top pt-5">
                            <div className="small mb-2">DESCRIPTION</div>
                            <p><small>{productDetails.description}</small></p>

                            <div className="small mb-2">MATERIAL</div>
                            <p><small>{_.upperFirst(productDetails.material)}</small></p>

                            <div className="small mb-2">CARE</div>
                            <p><small>{productDetails.care}</small></p>

                            <div className="mb-2 small">ORIGIN</div>
                            <p><small>{_.upperFirst(productDetails.origin)}</small></p>
                        </div>

                        {/* SHIPPING & RETURNS */}
                        <div className="border-top mt-5 pt-3">
                            <button
                                type="button"
                                className="shipping-returns-button"
                                onClick={() => togglePanel("shipping")}
                            >
                                <div className="small">SHIPPING & RETURNS</div>
                                <i className="bi bi-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ProductsCarouselComponent />

            <Footer />

            <ShippingReturns
                open={activePanel === "shipping"}
                onClose={closePanel}
                data={productDetails}
            />

            <AddToBagModalContainer
                productId={productId}
                onClose={() => setProductId(null)}
            />
        </main>
    );
}

export const ProductDetailsContainer = connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
