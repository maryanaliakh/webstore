import {useEffect, useState} from "react";
import {connect} from "react-redux";
import type {RootState} from "../../store";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import * as thunk from "../../thunks/product.ts";
import {useNavigate} from "react-router-dom";
import * as cartAction from "../../store/cart/action.ts";
import type {CartItem} from "../../store/cart/types.ts";
import {createPortal} from "react-dom";
import * as action from "../../store/product/action.ts";

interface AddToBagModalOwnProps {
    productId: number | null;
    onClose: () => void;
}

const mapStateToProps = (state: RootState) => ({
    product: state.modalProductDetails,
    cart: state.cart.items
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetch: (productId: number, color?: string) => dispatch(thunk.fetchModalProductDetailsThunk(productId, color)),
    onAddToCart: (item: CartItem) => dispatch(cartAction.addToCart(item)),
    onToggleFavorite: (productId: number) => dispatch(action.toggleProductFavorites(productId))
});

type AddToBagModalProps = AddToBagModalOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function AddProductToBag({productId, product, cart, onClose, onFetch, onAddToCart, onToggleFavorite}: AddToBagModalProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (productId === null) return;
        setSelectedSize(null);
        onFetch(productId);
    }, [productId]);

    useEffect(() => {
        if (productId === null) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [productId, onClose]);

    const currentProduct = productId !== null && product.id === productId ? product : null;

    const changeColor = (color: string) => {
        if (!currentProduct || color === currentProduct.selectedColor) return;

        setSelectedSize(null);
        onFetch(currentProduct.id, color);
    };

    const selectedVariant = currentProduct?.variants.find(v => v.size === selectedSize);

    const handleAddToBag = () => {
        if (!selectedVariant || !currentProduct || selectedVariant.stock <= 0) return;

        const existingQuantity = cart.find(item => item.variantId === selectedVariant.id)?.quantity ?? 0;

        if (existingQuantity >= selectedVariant.stock) return;

        const cartItem: CartItem = {
            productId: currentProduct.id,
            variantId: selectedVariant.id,
            quantity: 1,
            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.images[0]?.url ?? "",
            color: currentProduct.selectedColor,
            size: selectedVariant.size,
            stock: selectedVariant.stock
        };

        onAddToCart(cartItem);
        onToggleFavorite(currentProduct.id)
        onClose();
    };

    if (productId === null) return null;

    return createPortal(
        <>
            <div className="add-to-bag-overlay" onClick={onClose}/>

            <aside className="add-to-bag-panel" role="dialog" aria-modal="true" aria-label="Add to bag">
                <div className="d-flex justify-content-between align-items-center ">
                    <span>ADD TO BAG</span>
                    <button type="button" className="btn p-0 fs-4" onClick={onClose} aria-label="Close">
                        <i className="bi bi-x"></i>
                    </button>
                </div>

                {!currentProduct ? (
                    <p className="text-muted pt-4"><small>LOADING...</small></p>
                ) : (
                    <>
                        <div className="d-flex gap-3 py-4">
                            <img
                                src={currentProduct.images[0]?.url}
                                alt={currentProduct.name}
                                style={{width: 150, aspectRatio: "3 / 4", objectFit: "cover"}}
                            />

                            <div>
                                <div className="mb-2 small">{currentProduct.name.toUpperCase()}</div>
                                <h6 className="mb-4 fw-semibold">{currentProduct.price} zł</h6>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className=" mb-3 small">
                                {currentProduct.selectedColor?.toUpperCase()}
                            </h6>

                            <div className="d-flex gap-3 flex-wrap">
                                {currentProduct.colors.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        title={color}
                                        className="p-0 border-0 bg-transparent"
                                        onClick={() => changeColor(color)}
                                    >
                                        <span style={{
                                            display: "block",
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            backgroundColor: color.toLowerCase(),
                                            border: "1px solid #ccc",
                                            boxShadow: currentProduct.selectedColor === color
                                                ? "0 0 0 2px white, 0 0 0 3px black"
                                                : "none"
                                        }}/>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-5">
                            <h6 className="fw-normal mb-2 small">SIZE</h6>

                            <div className="d-flex gap-2 flex-wrap">
                                {currentProduct.variants.map(variant => (
                                    <button
                                        key={variant.id}
                                        type="button"
                                        disabled={variant.stock === 0}
                                        className={`btn rounded-0 btn-sm px-3 py-2 ${selectedSize === variant.size ? "btn-dark" : "btn-light"}`}
                                        onClick={() => {
                                            setSelectedSize(variant.size);
                                        }}
                                    >
                                        {variant.size.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            <button
                                type="button"
                                className="btn btn-dark w-100 mb-3 rounded-0 btn-sm px-3 py-3"
                                onClick={handleAddToBag}
                                disabled={
                                    !selectedVariant ||
                                    selectedVariant.stock === 0 ||
                                    (cart.find(item => item.variantId === selectedVariant.id)?.quantity ?? 0) >= selectedVariant.stock
                                }
                            >
                                ADD TO BAG
                            </button>
                            <button
                                type="button"
                                className="btn btn-light w-100 rounded-0 btn-sm px-3 py-3"
                                onClick={() => {
                                    if (productId === null) return;
                                    onClose();
                                    navigate(`/product/${productId}`);
                                }}
                            >
                                VIEW PRODUCT
                            </button>
                        </div>
                    </>
                )}
            </aside>
        </>,
        document.body
    );
}

export const AddToBagModalContainer = connect(mapStateToProps, mapDispatchToProps)(AddProductToBag);
