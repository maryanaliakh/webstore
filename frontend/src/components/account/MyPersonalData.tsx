import type {User} from "../../store/user/types.ts";
import {QRCodeSVG} from "qrcode.react";
import {useState} from "react";
import MembershipModal from "../modal/MembershipModal.tsx";

type Props = {
    user: User | null;
};

function MyPersonalData({user}: Props) {
    const [showMembershipModal, setShowMembershipModal] = useState(false);
    return (
        <div className="pt-3 d-flex align-items-start gap-5">
            <div
                className="p-3 mb-5 text-white rounded-2 d-flex flex-column justify-content-between"
                style={{
                    background: "#FF6B35",
                    width: "85%",
                    maxWidth: "400px",
                    minHeight: "240px",
                    zIndex: 1
                }}
                onClick={() => setShowMembershipModal(true)}
            >
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h3 className="fw-semibold mb-0">BUBBLE</h3>
                        <div className="fw-semibold small">MEMBERSHIP CARD</div>
                    </div>

                    <div className="bg-white rounded-1 p-1">
                        <QRCodeSVG
                            value={`BUBBLE-MEMBER-${user?.id || "GUEST"}`}
                            size={80}
                            bgColor="#ffffff"
                            fgColor="#111111"
                            level="M"
                        />
                    </div>
                </div>

                <div>
                    <div className="fs-1 fw-semibold">
                        {user?.name?.toUpperCase() || "CUSTOMER"}
                    </div>
                    <div className="small">{user?.email}</div>
                </div>
            </div>

            <div className="flex-grow-1">
                <div className="pb-2">
                    <small>Full name</small>
                    <div className="pt-1 small">
                        {user?.name?.toUpperCase() || "—"}
                    </div>
                </div>

                <div className="py-3">
                    <small>Email address</small>
                    <div className="pt-1 small">
                        {user?.email?.toUpperCase() || "—"}
                    </div>
                </div>

                <div className="pt-2">
                    <small>Phone number</small>
                    <div className="pt-1 small">
                        {user?.phone || "—"}
                    </div>
                </div>
            </div>
            {showMembershipModal && (
                <MembershipModal
                    user={user}
                    onClose={() => setShowMembershipModal(false)}
                />
            )}
        </div>
    );
}

export default MyPersonalData;
