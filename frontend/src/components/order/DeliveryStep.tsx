import {useState} from "react";
import type {OrderForm} from "./ContactStep.tsx";
import type {ShippingOption} from "../../store/shipping/types.ts";

type DeliveryStepProps = {
    shippingOptions: ShippingOption[];
    shippingOptionId: number;
    setShippingOptionId: (id: number) => void;
    form: OrderForm;
    updateField: (field: keyof OrderForm, value: string) => void;
    onBack: () => void;
    onContinue: () => void;
    onSaveAddressChange: (save: boolean) => void;
};

function DeliveryStep({shippingOptions, shippingOptionId, setShippingOptionId, form, updateField, onBack, onContinue, onSaveAddressChange}: DeliveryStepProps) {
    const inputClass = "form-control rounded-0 mb-3 p-3";
    const [saveAddress, setSaveAddress] = useState(false);

    const selectedShipping = shippingOptions.find(option => option.id === shippingOptionId);

    const isPickup = selectedShipping?.name === "Pickup point";
    const isStore = selectedShipping?.name === "Delivery to store";
    const needsAddress = Boolean(selectedShipping && !isPickup && !isStore);

    const handleSaveAddressChange = (checked: boolean) => {
        setSaveAddress(checked);
        onSaveAddressChange(checked);
    };

    return (
        <section className="pb-5">
            <div className="mb-4 small fw-semibold">CHOOSE DELIVERY METHOD</div>

            <div className="d-flex flex-column gap-2 mb-4">
                {shippingOptions.map(option => (
                    <label
                        key={option.id}
                        className={`d-flex align-items-start gap-3 p-3 rounded-0 border ${shippingOptionId === option.id ? "bg-light border" : ""}`}
                        style={{cursor: "pointer"}}
                    >
                        <input
                            className="form-check-input mt-1"
                            type="radio"
                            name="shipping"
                            checked={shippingOptionId === option.id}
                            onChange={() => {
                                setShippingOptionId(option.id);
                                setSaveAddress(false);
                                onSaveAddressChange(false);
                            }}
                        />

                        <span className="flex-grow-1">
                            <div className="d-block small fw-semibold">
                                {option.name.toUpperCase()}
                            </div>
                            <small>{option.description} · {option.delivery_time}</small>
                        </span>

                        <div className="small text-nowrap fw-semibold">
                            {Number(option.price).toFixed(2)} zł
                        </div>
                    </label>
                ))}
            </div>

            {needsAddress && (
                <>
                    <div className="mb-4 small fw-semibold">INPUT DELIVERY ADDRESS</div>

                    <div className="row">
                        <div className="col-md-6">
                            <input
                                className={inputClass}
                                placeholder="Country"
                                required
                                value={form.shippingCountry}
                                onChange={e => updateField("shippingCountry", e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className={inputClass}
                                placeholder="City"
                                required
                                value={form.shippingCity}
                                onChange={e => updateField("shippingCity", e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className={inputClass}
                                placeholder="Postal code"
                                required
                                value={form.shippingPostalCode}
                                onChange={e => updateField("shippingPostalCode", e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <input
                                className={inputClass}
                                placeholder="Street"
                                required
                                value={form.shippingStreet}
                                onChange={e => updateField("shippingStreet", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-6">
                            <input
                                className={inputClass}
                                placeholder="Building number"
                                required
                                value={form.shippingBuilding}
                                onChange={e => updateField("shippingBuilding", e.target.value)}
                            />
                        </div>

                        <div className="col-6">
                            <input
                                className={inputClass}
                                placeholder="Apartment (optional)"
                                value={form.shippingApartment}
                                onChange={e => updateField("shippingApartment", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-check mb-4 pt-2">
                        <input
                            className="form-check-input rounded-0"
                            type="checkbox"
                            id="saveAddress"
                            checked={saveAddress}
                            onChange={e => handleSaveAddressChange(e.target.checked)}
                        />
                        <label className="form-check-label small" htmlFor="saveAddress">
                            SAVE THIS ADDRESS TO MY ACCOUNT
                        </label>
                    </div>
                </>
            )}

            {isPickup && (
                <>
                    <div className="mb-4 small fw-semibold">PICKUP POINT</div>
                    <input
                        className={inputClass}
                        placeholder="Pickup point name or ID"
                        required
                        value={form.pickupPointName}
                        onChange={e => updateField("pickupPointName", e.target.value)}
                    />
                </>
            )}

            {isStore && (
                <>
                    <div className="mb-4 small fw-semibold">STORE DETAILS</div>
                    <input
                        className={inputClass}
                        placeholder="BUBBLE store name or ID"
                        required
                        value={form.storeName}
                        onChange={e => updateField("storeName", e.target.value)}
                    />
                </>
            )}

            <div className="d-flex justify-content-between gap-3 mt-5 pb-3">
                <button
                    type="button"
                    className="btn rounded-0 py-3 px-0 d-flex align-items-center justify-content-start gap-2"
                    onClick={onBack}
                >
                    <i className="bi-arrow-left"></i>
                    <span className="small">BACK TO CONTACT INFORMATION</span>
                </button>

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

export default DeliveryStep;