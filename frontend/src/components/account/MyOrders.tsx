import {useEffect, useState} from "react";
import {connect} from "react-redux";
import type {RootState} from "../../store";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {Order} from "../../store/order/types.ts";
import {fetchUserOrdersThunk} from "../../thunks/order.ts";

const mapStateToProps = (state: RootState) => ({
    orders: state.order.data,
    loading: state.order.loading,
    error: state.order.error
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    loadOrders: () => dispatch(fetchUserOrdersThunk())
});

type MyOrdersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function MyOrders({orders, loading, error, loadOrders}: MyOrdersProps) {
    const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const toggleOrder = (id: number) => {
        setExpandedOrders(prev =>
            prev.includes(id)
                ? prev.filter(orderId => orderId !== id)
                : [...prev, id]
        );
    };

    if (loading) {
        return <div className="py-5 text-center small">LOADING ORDERS...</div>;
    }

    if (error) {
        return <div className="py-4 text-danger small">{error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center text-center py-5" style={{minHeight: "400px"}}>
                <p className="text-muted small">Your orders will appear here.</p>
            </div>
        );
    }

    return (
        <div className="w-100 text-dark pt-3">

            {orders.map((order: Order) => {
                const isAddress = order.shipping_country && order.shipping_city;
                const isExpanded = expandedOrders.includes(order.id);

                return (
                    <div key={order.id} className=" mb-3">
                        {/* COLLAPSIBLE HEADER */}
                        <div
                            role="button"
                            onClick={() => toggleOrder(order.id)}
                            className="d-flex flex-wrap justify-content-between align-items-center gap-3 p-3 rounded-0 border"
                            style={{cursor: "pointer"}}
                        >
                            <div>
                                <div className="fw-semibold small">ORDER #{order.id}</div>
                                <small className="text-muted">
                                    {order.created_at
                                        ? new Date(order.created_at).toLocaleDateString("en-GB", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric"
                                        })
                                        : ""}
                                </small>
                            </div>

                            <div className="d-flex align-items-center gap-3">
                                <span className="border border-dark px-3 py-2 small fw-semibold">
                                    {order.status.replace("_", " ").toUpperCase()}
                                </span>
                                <span className="fw-semibold small">
                                    {Number(order.total).toFixed(2)} zł
                                </span>
                                <i className={`bi ${isExpanded ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                            </div>
                        </div>

                        {/* EXPANDED CONTENT */}
                        {isExpanded && (
                            <div className="pb-4">
                                <div className="py-3">
                                    <div className="small fw-semibold mb-3">
                                        ITEMS ({order.order_items.length})
                                    </div>

                                    {order.order_items.map(item => (
                                        <div key={item.id} className="row g-3 py-3">
                                            <div className="col-4 col-sm-3 col-md-2">
                                                <img
                                                    src={item.image_url || "/images/product-placeholder.png"}
                                                    alt={item.product_name}
                                                    className="w-100"
                                                    style={{
                                                        aspectRatio: "3 / 4",
                                                        objectFit: "cover",
                                                        background: "#f5f5f5"
                                                    }}
                                                />
                                            </div>

                                            <div className="col d-flex flex-column justify-content-between">
                                                <div>
                                                    <div className="fw-semibold small mb-2">
                                                        {item.product_name.toUpperCase()}
                                                    </div>
                                                    <div className="small text-muted mb-1">
                                                        COLOUR: {item.color.toUpperCase()}
                                                    </div>
                                                    <div className="small text-muted mb-1">
                                                        SIZE: {item.size.toUpperCase()}
                                                    </div>
                                                    <div className="small text-muted">
                                                        QUANTITY: {item.quantity}
                                                    </div>
                                                </div>

                                                <div className="fw-semibold small mt-3">
                                                    {(Number(item.price) * item.quantity).toFixed(2)} zł
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-3">

                                    <div className="d-flex justify-content-between gap-3 small mb-3">
                                        <span className="text-muted">PAYMENT METHOD</span>
                                        <span className="fw-semibold text-end">{order.payment_method}</span>
                                    </div>

                                    <div className="d-flex justify-content-between gap-3 small mb-3">
                                        <span className="text-muted">DELIVERY METHOD</span>
                                        <span className="fw-semibold text-end">{order.shipping_method}</span>
                                    </div>

                                    {isAddress && (
                                        <div className="d-flex justify-content-between gap-3 small mb-3">
                                            <span className="text-muted">DELIVERY ADDRESS</span>
                                            <span className="fw-semibold text-end">
                                                {order.shipping_street} {order.shipping_building}
                                                {order.shipping_apartment ? `/${order.shipping_apartment}` : ""}
                                                <br />
                                                {order.shipping_postal_code} {order.shipping_city}
                                                <br />
                                                {order.shipping_country}
                                            </span>
                                        </div>
                                    )}

                                    {order.pickup_point_name && (
                                        <div className="d-flex justify-content-between gap-3 small mb-3">
                                            <span className="text-muted">PICKUP POINT</span>
                                            <span className="fw-semibold text-end">{order.pickup_point_name}</span>
                                        </div>
                                    )}

                                    {order.store_name && (
                                        <div className="d-flex justify-content-between gap-3 small mb-3">
                                            <span className="text-muted">STORE</span>
                                            <span className="fw-semibold text-end">{order.store_name}</span>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between gap-3 small mb-3">
                                        <span className="text-muted">SUBTOTAL</span>
                                        <span className="fw-semibold">{Number(order.subtotal).toFixed(2)} zł</span>
                                    </div>

                                    <div className="d-flex justify-content-between gap-3 small mb-3">
                                        <span className="text-muted">SHIPPING</span>
                                        <span className="fw-semibold">{Number(order.shipping_price).toFixed(2)} zł</span>
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center  pt-3 mt-3">
                                        <span className="fw-semibold">TOTAL</span>
                                        <span className="fw-semibold fs-5">
                                            {Number(order.total).toFixed(2)} zł
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MyOrders);