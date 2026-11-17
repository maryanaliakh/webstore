
import type {User} from "../../store/user/types.ts";
import {QRCodeSVG} from "qrcode.react";

type Props = {
    user: User | null;
    onClose: () => void;
};

function MembershipModal({user, onClose}: Props) {
    return (
        <div
            className="modal d-block"
            tabIndex={-1}
            style={{
                background: "rgba(255,255,255,0.45)",
                backdropFilter: "blur(8px)",
                zIndex: 2000
            }}
            onClick={onClose}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered" onClick={e => e.stopPropagation()}>
                <div className="modal-content border-0 rounded-0 overflow-hidden shadow">
                    <div
                        className="position-relative d-flex align-items-center justify-content-center overflow-hidden"
                        style={{minHeight: "420px"}}
                    >
                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{
                                backgroundImage: "url('https://images.pexels.com/photos/14534753/pexels-photo-14534753.jpeg')",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                filter: "blur(10px)",
                                transform: "scale(1.1)"
                            }}
                        />

                        <div
                            className="position-absolute top-0 start-0 w-100 h-100"
                            style={{background: "rgba(0,0,0,0.15)"}}
                        />

                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-4"
                            style={{zIndex: 2}}
                            onClick={onClose}
                        />

                        {/* Membership card */}
                        <div
                            className="position-relative p-3 text-white rounded-3 d-flex flex-column justify-content-between shadow"
                            style={{
                                background: "#FF6B35",
                                width: "75%",
                                maxWidth: "400px",
                                minHeight: "240px",
                                zIndex: 1
                            }}
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <h2 className="fw-semibold mb-0">BUBBLE</h2>
                                    <div className="fw-semibold small">MEMBERSHIP CARD</div>
                                </div>

                                <div className="bg-white rounded-1 p-1">
                                    <QRCodeSVG
                                        value={`BUBBLE-MEMBER-${user?.id || "GUEST"}`}
                                        size={70}
                                        bgColor="#ffffff"
                                        fgColor="#111111"
                                        level="M"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="fs-3 fw-semibold">
                                    {user?.name?.toUpperCase() || "CUSTOMER"}
                                </div>
                                <div className="small">{user?.email || ""}</div>
                            </div>
                        </div>
                    </div>

                    {/* Information */}
                    <div className="text-center bg-white px-3 py-4">
                        <h4 className="fw-bold mb-2">YOUR BUBBLE MEMBERSHIP CARD</h4>
                        <p className="text-secondary small mb-0">
                            IDENTIFY YOURSELF IN OUR STORE TO:
                        </p>
                        <p className="text-secondary small mb-0">
                            COLLECT POINTS AND ENJOY EXCLUSIVE BENEFITS
                        </p>
                        <p className="text-secondary small mb-0">
                            MANAGE YOUR ORDERS AND RETURNS
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default MembershipModal;
