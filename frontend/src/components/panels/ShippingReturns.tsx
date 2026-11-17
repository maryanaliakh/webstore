import {createPortal} from "react-dom";
import type {RootState} from "../../store";
import * as _ from "lodash";

type ShippingData = Pick<RootState["productDetails"], "shipOptions" | "returnOptions" | "returnPolicy">;

interface ShippingReturnsProps {
    open: boolean;
    onClose: () => void;
    data: ShippingData;
}

function ShippingReturns({open, onClose, data}: ShippingReturnsProps) {

    if (!open) return null;

    return createPortal(
        <>
            <div className="search-overlay open" onClick={onClose}/>

            <aside className="shipping-panel open" role="dialog" aria-modal="true" aria-label="Shipping and returns">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fw-normal">SHIPPING & RETURNS</span>

                    <button type="button" className="btn p-0 fs-4" onClick={onClose} aria-label="Close">
                        <i className="bi bi-x"></i>
                    </button>
                </div>

                {/* SHIPPING */}
                <div className="mb-4">
                    <div className="pb-2 small">SHIPPING</div>

                    {data.shipOptions.map(option => (
                        <div key={option.id} className="mb-4">
                            <div className="d-flex justify-content-between mb-1">
                                <div className="small">{_.upperCase(option.name)}</div>
                                <div className="small">{option.price === 0 ? "FREE" : `${option.price} zł`}</div>
                            </div>

                            <p className="mb-1"><small>{option.description}</small></p>
                            <div className="small">{option.deliveryTime}</div>
                        </div>
                    ))}
                </div>

                {/* RETURNS */}
                <div className="pt-4 mb-4">
                    <div className="pb-2 small">RETURNS</div>

                    {data.returnOptions.map(option => (
                        <div key={option.id} className="mb-4">
                            <div className="d-flex justify-content-between mb-1">
                                <div className="small">{_.upperCase(option.name)}</div>
                                <div className="small">{option.price === 0 ? "FREE" : `${option.price} zł`}</div>
                            </div>

                            <p className="mb-0"><small>{option.description}</small></p>
                        </div>
                    ))}
                </div>

                {/* RETURN POLICY */}
                <div className="pt-4">
                    <div className="pb-2 small">RETURN POLICY</div>

                    {data.returnPolicy.map(policy => (
                        <div key={policy.id} className="mb-4">
                            <div className="small">{_.upperCase(policy.title)}</div>
                            <p className="mb-0"><small>{policy.description}</small></p>
                        </div>
                    ))}
                </div>
            </aside>
        </>,
        document.body
    );
}

export default ShippingReturns;