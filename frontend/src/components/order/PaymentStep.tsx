
type PaymentMethod = {
    id: number;
    name: string;
};

type PaymentStepProps = {
    paymentMethods: PaymentMethod[];
    paymentMethod: string;
    setPaymentMethod: (method: string) => void;
    onBack: () => void;
    loading: boolean;
};

function PaymentStep({paymentMethods, paymentMethod, setPaymentMethod, onBack, loading}: PaymentStepProps) {
    return (
        <section className="pb-5">
            <div className="mb-4 small fw-semibold">CHOOSE PAYMENT METHOD</div>

            <div className="d-flex flex-column gap-2 mb-4">
                {paymentMethods.map(method => (
                    <label
                        key={method.id}
                        className={`d-flex align-items-center gap-3 p-3 rounded-0 border ${
                            paymentMethod === method.name ? "bg-light border" : ""
                        }`}
                        style={{cursor: "pointer"}}
                    >
                        <input
                            className="form-check-input mt-0"
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method.name}
                            onChange={() => setPaymentMethod(method.name)}
                        />

                        <span className="fw-medium">{method.name}</span>
                    </label>
                ))}
            </div>

            <small className="text-muted">
                All payments are simulated for demonstration purposes.
                No real payment details are collected.
            </small>

            <div className="d-flex justify-content-between gap-3 mt-5 pb-3">
                <button
                    type="button"
                    className="btn rounded-0 py-3 px-0 d-flex align-items-center justify-content-start gap-2"
                    onClick={onBack}
                >
                    <i className="bi-arrow-left"></i>
                    <span className="small">BACK TO DELIVERY METHOD</span>
                </button>

                <button
                    type="submit"
                    className="btn btn-dark rounded-0 py-3 px-4"
                    disabled={loading}
                >
                    {loading ? "PROCESSING..." : "PAY AND PLACE ORDER"}
                </button>
            </div>
        </section>
    );
}

export default PaymentStep;
