
export type OrderForm = {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingCountry: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingStreet: string;
    shippingBuilding: string;
    shippingApartment: string;
    pickupPointName: string;
    storeName: string;
};

type ContactStepProps = {
    form: OrderForm;
    updateField: (field: keyof OrderForm, value: string) => void;
    onBack: () => void;
    onContinue: () => void;
};

function ContactStep({form, updateField, onContinue}: ContactStepProps) {
    const inputClass = "form-control rounded-0 mb-3 p-3";

    return (
        <section className="pb-5">
            <div className="mb-4 small fw-semibold">INPUT CONTACT INFORMATION</div>

            <input
                className={inputClass}
                placeholder="Full name"
                required
                value={form.customerName}
                onChange={e => updateField("customerName", e.target.value)}
            />

            <input
                className={inputClass}
                type="email"
                placeholder="Email address"
                required
                value={form.customerEmail}
                onChange={e => updateField("customerEmail", e.target.value)}
            />

            <input
                className={inputClass}
                type="tel"
                placeholder="Phone number"
                required
                value={form.customerPhone}
                onChange={e => updateField("customerPhone", e.target.value)}
            />

            <div className="d-flex justify-content-end gap-3 mt-5 pb-3">

                <button
                    type="button"
                    className="btn btn-dark rounded-0 py-3 px-4"
                    onClick={onContinue}
                >
                   <span className="small">CONTINUE</span>
                </button>
            </div>
        </section>
    );
}

export default ContactStep;
