
import {useEffect, useState} from "react";
import type {FormEvent} from "react";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import type {Action} from "redux";
import type {ThunkDispatch} from "@reduxjs/toolkit";
import type {RootState} from "../store";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import ContactStep from "../components/order/ContactStep.tsx";
import DeliveryStep from "../components/order/DeliveryStep.tsx";
import PaymentStep from "../components/order/PaymentStep.tsx";
import type {OrderForm} from "../components/order/ContactStep.tsx";
import {clearCart} from "../store/cart/action.ts";
import type {CreateOrderInput} from "../api/order.ts";
import {fetchShippingThunk} from "../thunks/shipping.ts";
import {fetchPaymentThunk} from "../thunks/payment.ts";
import {createOrderThunk} from "../thunks/order.ts";
import {fetchDiscountsThunk} from "../thunks/discount.ts";
import {fetchProductsThunk} from "../thunks/product.ts";

const mapStateToProps = (state: RootState) => ({
    products: state.product.data,
    items: state.cart.items,
    user: state.user.data,
    shippingOptions: state.shipping.data,
    paymentMethods: state.payment.data,
    discounts: state.discount.data
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    onFetchShipping: () => dispatch(fetchShippingThunk()),
    onFetchPayment: () => dispatch(fetchPaymentThunk()),
    onCreateOrder: (data: CreateOrderInput) => dispatch(createOrderThunk(data)),
    onClearCart: () => dispatch(clearCart()),
    onFetchDiscounts: () => dispatch(fetchDiscountsThunk()),
    onFetchProducts: () => dispatch(fetchProductsThunk())
});

type OrderProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Order({items, user, discounts, products, shippingOptions, paymentMethods, onFetchProducts, onFetchDiscounts, onFetchShipping, onFetchPayment, onCreateOrder, onClearCart}: OrderProps) {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [shippingOptionId, setShippingOptionId] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState("Card");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [saveAddress, setSaveAddress] = useState(false);

    const [form, setForm] = useState<OrderForm>({
        customerName: "",
        customerEmail: "",
        customerPhone: "",
        shippingCountry: "Poland",
        shippingCity: "",
        shippingPostalCode: "",
        shippingStreet: "",
        shippingBuilding: "",
        shippingApartment: "",
        pickupPointName: "",
        storeName: ""
    });

    useEffect(() => {
        document.title = "Order";
        onFetchProducts();
        onFetchShipping();
        onFetchPayment();
        onFetchDiscounts();
    }, [onFetchShipping, onFetchPayment, onFetchDiscounts, onFetchProducts]);

    useEffect(() => {
        if (shippingOptions.length > 0 && shippingOptionId === 0) {
            setShippingOptionId(shippingOptions[0].id);
        }
    }, [shippingOptions, shippingOptionId]);

    useEffect(() => {
        if (paymentMethods.length > 0) {
            setPaymentMethod(paymentMethods[0].name);
        }
    }, [paymentMethods]);

    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                customerName: user.name || "",
                customerEmail: user.email || "",
                customerPhone: user.phone || ""
            }));
        }
    }, [user]);

    useEffect(() => {
        if (items.length === 0) navigate("/cart", {replace: true});
    }, [items.length, navigate]);

    const selectedShipping = shippingOptions.find(
        option => option.id === shippingOptionId
    );

    const isPickup = selectedShipping?.name === "Pickup point";
    const isStore = selectedShipping?.name === "Delivery to store";
    const needsAddress = Boolean(selectedShipping && !isPickup && !isStore);

    const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity, 0
    );
    const shippingPrice = Number(selectedShipping?.price || 0);
    const total = subtotal + shippingPrice;

    const updateField = (field: keyof OrderForm, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
        setError("");
    };

    const handleNext = () => {
        setError("");

        if (step === 1) {
            if (!form.customerName.trim() || !form.customerEmail.trim() ||
                !form.customerPhone.trim()) {
                setError("Please complete all contact information");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
                setError("Please enter a valid email address");
                return;
            }

            setStep(2);
            return;
        }

        if (step === 2) {
            if (!selectedShipping) {
                setError("Please select a delivery method");
                return;
            }

            if (needsAddress && (
                !form.shippingCountry.trim() ||
                !form.shippingCity.trim() ||
                !form.shippingPostalCode.trim() ||
                !form.shippingStreet.trim() ||
                !form.shippingBuilding.trim()
            )) {
                setError("Please complete your delivery address");
                return;
            }

            if (isPickup && !form.pickupPointName.trim()) {
                setError("Please enter a pickup point");
                return;
            }

            if (isStore && !form.storeName.trim()) {
                setError("Please enter a store");
                return;
            }

            setStep(3);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!selectedShipping) {
            setError("Please select a delivery method");
            setStep(2);
            return;
        }

        if (!paymentMethod) {
            setError("Please select a payment method");
            return;
        }

        const orderData: CreateOrderInput = {
            customerName: form.customerName,
            customerEmail: form.customerEmail,
            customerPhone: form.customerPhone,
            shippingOptionId,
            paymentMethod,
            items: items.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity
            })),
            ...(needsAddress && {
                shippingCountry: form.shippingCountry,
                shippingCity: form.shippingCity,
                shippingPostalCode: form.shippingPostalCode,
                shippingStreet: form.shippingStreet,
                shippingBuilding: form.shippingBuilding,
                shippingApartment: form.shippingApartment
            }),
            ...(isPickup && {pickupPointName: form.pickupPointName}),
            ...(isStore && {storeName: form.storeName})
        };

        try {
            setLoading(true);

            const result = await onCreateOrder(orderData);

            if (saveAddress && user && needsAddress) {
                try {
                    await saveUserAddress();
                } catch (addressError) {
                    console.error("Address saving error:", addressError);
                }
            }

            onClearCart();
            navigate("/order-success", {state: {order: result.order}});
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create order");
        } finally {
            setLoading(false);
        }
    };

    const saveUserAddress = async () => {
        if (!saveAddress || !user || !needsAddress) return;

        const response = await fetch("http://localhost:3000/api/addresses", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: form.customerName,
                phone: form.customerPhone,
                country: form.shippingCountry,
                city: form.shippingCity,
                postal_code: form.shippingPostalCode,
                street: form.shippingStreet,
                building: form.shippingBuilding,
                apartment: form.shippingApartment || null
            })
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.message || "Could not save address");
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="container-fluid px-0 flex-grow-1 d-flex flex-column">
                <form onSubmit={handleSubmit} className="d-flex flex-column flex-grow-1">
                    <div className="row g-0 align-items-stretch flex-grow-1 order-page-row">
                        <div className="col-lg-8 px-4">
                            <div className="order-form-sticky">
                                <div className="order-form-content">

                                {/* ORDER STEPS */}
                                <div className="d-flex align-items-center flex-wrap pt-5 pb-3">

                                    {[
                                        {id: 1, name: "CONTACT"},
                                        {id: 2, name: "DELIVERY"},
                                        {id: 3, name: "PAYMENT"}
                                    ].map((item, index) => (
                                        <div key={item.id} className="d-flex align-items-center gap-2">
                                            <div className={step === item.id ? "fw-bold small" : "small"}>
                                                {item.name}
                                            </div>
                                            {index < 2 && (
                                                <i className="bi bi-chevron-right px-3"></i>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                    {error && (
                                        <div className="alert alert-danger rounded-0 d-flex align-items-center gap-2 "
                                             role="alert">
                                            <i className="bi bi-exclamation-circle-fill"></i>
                                            <span className="small fw-medium">{error}</span>
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <ContactStep
                                            form={form}
                                            updateField={updateField}
                                            onBack={() => navigate("/cart")}
                                            onContinue={handleNext}
                                        />
                                    )}

                                    {step === 2 && (
                                        <DeliveryStep
                                            shippingOptions={shippingOptions}
                                            shippingOptionId={shippingOptionId}
                                            setShippingOptionId={id => {
                                                setShippingOptionId(id);
                                                setError("");
                                            }}
                                            form={form}
                                            updateField={updateField}
                                            onBack={() => {
                                                setError("");
                                                setStep(1);
                                            }}
                                            onContinue={handleNext}
                                            onSaveAddressChange={setSaveAddress}
                                        />
                                    )}

                                    {step === 3 && (
                                        <PaymentStep
                                            paymentMethods={paymentMethods}
                                            paymentMethod={paymentMethod}
                                            setPaymentMethod={setPaymentMethod}
                                            onBack={() => {
                                                setError("");
                                                setStep(2);
                                            }}
                                            loading={loading}
                                        />
                                    )}
                            </div>
                        </div>
                        </div>


                        {/* YOUR ORDER */}
                        <div className="col-lg-4 order-summary-column">

                            <div className="order-summary-title px-xl-4">
                                <div className="mb-3 small fw-semibold">YOUR ORDER</div>
                            </div>

                            {/* PRODUCTS SCROLL */}
                            <div className="order-items-scroll px-xl-4">
                                {items.map(item => {
                                    const discount = discounts.find(
                                        d => d.id === products.find(p => p.id === item.productId)?.discount_id
                                    );

                                    const price = Number(item.price);
                                    const finalPrice = discount
                                        ? price * (1 - Number(discount.percentage) / 100)
                                        : price;

                                    return (
                                        <div key={item.variantId} className="d-flex gap-2 mb-4">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="object-fit-cover"
                                                style={{width: "90px", aspectRatio: "3 / 4"}}
                                            />

                                            <div className="flex-grow-1 px-2">
                                                <div className="d-flex align-items-center gap-2 pb-2">
                                                <span className={`fw-semibold small ${discount ? "bg-danger text-white px-1" : ""}`}>
                                                    {(finalPrice * item.quantity).toFixed(2)} zł

                                                    {discount && (
                                                        <span className="text-white ms-2">
                                                            -{Number(discount.percentage)}%
                                                        </span>
                                                    )}
                                                </span>

                                                    {discount && (
                                                        <span className="fw-semibold text-secondary text-decoration-line-through small">
                                                        {(price * item.quantity).toFixed(2)} zł
                                                    </span>
                                                    )}
                                                </div>

                                                <div className="mb-1 fw-semibold small">
                                                    {item.name.toUpperCase()}
                                                </div>

                                                <small>
                                                    {item.color.toUpperCase()} {item.size.toUpperCase()} / {item.quantity} QTY.
                                                </small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ORDER TOTAL */}
                            <div className="order-summary-total px-xl-4 pt-4">
                                <div className="d-flex justify-content-between small mb-2">
                                    ORDER VALUE
                                    <span className="fw-semibold">{subtotal.toFixed(2)} zł</span>
                                </div>

                                <div className="d-flex justify-content-between small mb-4">
                                    SHIPPING
                                    <span className="fw-semibold">{shippingPrice.toFixed(2)} zł</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center pb-5 mb-2">
                                    <span className="fw-semibold">TOTAL</span>
                                    <h5 className="fw-semibold m-0">{total.toFixed(2)} zł</h5>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}

export const OrderContainer = connect(mapStateToProps, mapDispatchToProps)(Order);
