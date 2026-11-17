import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import type {RootState} from "../store";
import type {ThunkDispatch} from "redux-thunk";
import type {Action} from "redux";
import * as cartAction from "../store/cart/action.ts";
import * as productAction from "../store/product/action.ts";
import {ProductCard} from "../components/product/ProductCard.tsx";
import * as thunk from "../thunks/product.ts";

const mapStateToProps = (state: RootState) => ({
    items: state.cart.items,
    products: state.product.data,
    favorites: state.productFavorites.ids,
    discounts: state.discount.data,
    user: state.user.data
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchProducts: () => dispatch(thunk.fetchProductsThunk()),
    onRemove: (variantId: number) => dispatch(cartAction.removeFromCart(variantId)),
    onUpdateQuantity: (variantId: number, quantity: number) =>
        dispatch(cartAction.updateCartQuantity(variantId, quantity)),
    onToggleFavorite: (productId: number) =>
        dispatch(productAction.toggleProductFavorites(productId)),
});

type CartProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Cart({items, products, favorites, discounts, user, onRemove, onUpdateQuantity, onToggleFavorite, onFetchProducts}: CartProps) {
    const navigate = useNavigate();

    useEffect(() => {
        onFetchProducts();
    }, [onFetchProducts]);

    useEffect(() => {
        document.title = "Bag";
    }, []);

    const getItemDiscount = (item: typeof items[number]) => {
        const product = products.find(p => p.id === item.productId);

        return discounts.find(d => d.id === product?.discount_id);
    };

    const getItemPrice = (item: typeof items[number]) => {
        const discount = getItemDiscount(item);
        const price = Number(item.price);

        return discount
            ? price * (1 - Number(discount.percentage) / 100)
            : price;
    };

    const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
    const shipping = 9.90;
    const total = subtotal + shipping;

    console.table(
        items.map(item => ({
            productId: item.productId,
            name: item.name,
            found: products.some(
                p => Number(p.id) === Number(item.productId)
            )
        }))
    );

    console.log("Product IDs:", products.map(p => p.id));
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="container-fluid px-0 flex-grow-1 d-flex flex-column">
                {items.length > 0 ? (
                        <div className="row g-0 flex-grow-1 align-items-stretch">

                            <div className="col-lg-8 px-4 px-xl-4 pt-5 mt-2">
                                <div className="row g-1 mx-0">
                                {items.map(item => {
                                    const product = products.find(p => p.id === item.productId);

                                    if (!product) return null;

                                    return (
                                        <div key={item.variantId} className="col-6 col-md-4 col-lg-4 pb-4">
                                            <ProductCard
                                                product={product}
                                                price={Number(item.price)}
                                                favorite={favorites.includes(item.productId)}
                                                discounts={discounts}
                                                onToggleFavorite={onToggleFavorite}
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                showColors={false}
                                            >
                                                <div className="px-2 pb-3">
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <small>{item.color.toUpperCase()}</small>
                                                        <small>{item.size.toUpperCase()}</small>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-3">
                                                        <button
                                                            type="button"
                                                            className="btn p-0 border-0"
                                                            onClick={e => {
                                                                e.stopPropagation();

                                                                if (item.quantity <= 1) {
                                                                    onRemove(item.variantId);
                                                                } else {
                                                                    onUpdateQuantity(item.variantId, item.quantity - 1);
                                                                }
                                                            }}
                                                        >
                                                            <i className="bi bi-dash"></i>
                                                        </button>

                                                        <span className="small">{item.quantity}</span>

                                                        <button
                                                            type="button"
                                                            className="btn p-0 border-0"
                                                            disabled={item.quantity >= item.stock}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                onUpdateQuantity(item.variantId, item.quantity + 1);
                                                            }}
                                                        >
                                                            <i className="bi bi-plus"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </ProductCard>
                                        </div>
                                    );
                                })}
                                </div>
                            </div>


                            <div className="col-lg-4 py-4 ">
                                <div
                                    className="px-xl-4 py-4"
                                    style={{
                                        position: "sticky",
                                        top: "100px",
                                        alignSelf: "flex-start"
                                    }}
                                >

                                <div className="d-flex justify-content-between small mb-2">
                                    ORDER VALUE
                                    <span className="fw-semibold">{subtotal.toFixed(2)} zł</span>
                                </div>

                                <div className="d-flex justify-content-between mb-4 small">
                                    ESTIMATED SHIPPING
                                    <span className="fw-semibold">{shipping.toFixed(2)} zł</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <span className="fw-semibold">TOTAL</span>
                                    <h5 className="fw-semibold m-0">{total.toFixed(2)} zł</h5>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-dark w-100 mb-3 rounded-0 btn-sm py-3 px-3"
                                    onClick={() => navigate("/checkout")}
                                    disabled={items.length === 0}
                                >
                                    PROCEED TO CHECKOUT
                                </button>

                                {!user && (
                                    <button
                                        type="button"
                                        className="btn btn-light w-100 py-3 mb-4 rounded-0 btn-sm"
                                        onClick={() => navigate("/login")}
                                    >
                                        SIGN IN
                                    </button>
                                )}

                                <p className="mb-4 pt-5">
                                    <small>Final shipping costs depend on the selected delivery method.</small>
                                </p>

                                <div className="d-flex flex-wrap align-items-center gap-4 mb-4 justify-content-center">
                                    <span className="fw-semibold fst-italic">VISA</span>
                                    <span className="fw-semibold">Mastercard</span>
                                    <span className="fw-semibold">BLIK</span>
                                    <span className="fw-semibold">PayPal</span>
                                </div>

                                <p>
                                    <small>Delivery times and costs depend on the selected shipping method.</small>
                                </p>

                                <p className="pb-5 mb-3">
                                    <small>Need help? Contact our customer service team.</small>
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-outline-dark w-100 mt-2 rounded-0 btn-sm py-3 px-3"
                                    onClick={() => navigate("/products")}
                                >
                                    CONTINUE SHOPPING
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-column justify-content-center align-items-center text-center"
                         style={{minHeight: "500px"}}>
                        <p className="text-muted"><small>Your shopping bag is empty.</small></p>
                        <button
                            type="button"
                            className="btn btn-light rounded-0 btn-sm px-3 py-3"
                            onClick={() => navigate("/products")}
                        >
                            EXPLORE BUBBLE
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export const CartContainer = connect(mapStateToProps, mapDispatchToProps)(Cart);
