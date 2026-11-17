import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {connect} from "react-redux";
import type {RootState} from "../store";
import type {Action, ThunkDispatch} from "@reduxjs/toolkit";
import type {User} from "../store/user/types.ts";

import {logoutUserThunk} from "../thunks/auth.ts";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

import MyOrders from "../components/account/MyOrders.tsx";
import MyAddresses from "../components/account/MyAddresses.tsx";
import ChangePassword from "../components/account/ChangePassword.tsx";
import MyPersonalData from "../components/account/MyPersonalData.tsx";

type AccountSection = "personal" | "orders" | "addresses" | "password";

const mapStateToProps = (state: RootState) => ({
    user: state.user.data as User | null
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    logoutUser: () => dispatch(logoutUserThunk())
});

type AccountProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Account({user, logoutUser}: AccountProps) {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<AccountSection>("personal");

    const handleLogout = async () => {
        await logoutUser();
        navigate("/");
    };

    const menuItems: {id: AccountSection; label: string}[] = [
        {id: "personal", label: "PERSONAL INFORMATION"},
        {id: "orders", label: "MY ORDERS"},
        {id: "addresses", label: "MY ADDRESSES"},
        {id: "password", label: "CHANGE PASSWORD"}
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />

            <main className="container-fluid px-4 px-lg-5 py-5 flex-grow-1">
                <div className="row g-4">

                    {/* LEFT COLUMN */}
                    <aside className="col-12 col-lg-3">
                        <div className="d-flex align-items-start mb-5 gap-2">
                            <div className="me-2 pt-1">
                                <i
                                    className="bi bi-stars"
                                    style={{color: "#FF6B35", fontSize: "30px"}}
                                ></i>
                            </div>

                            <div className="flex-grow-1 mt-1">
                                <div className="fs-2 fw-bold text-nowrap mb-5">
                                    HELLO, {user?.name?.toUpperCase() || "CUSTOMER"}!
                                </div>

                                <div className="d-flex flex-column align-items-start">
                                    {menuItems.map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => setActiveSection(item.id)}
                                            className={`text-start py-2 my-1 px-0 border-0 bg-transparent small ${
                                                activeSection === item.id
                                                    ? "fw-semibold"
                                                    : "text-muted"
                                            }`}
                                        >
                                            {item.label}
                                        </button>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-start px-0 pt-2 small border-0 bg-transparent fw-semibold"
                                    >
                                        LOG OUT
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* CENTER COLUMN */}
                    <section className="col-12 col-lg-8 mx-lg-5 px-lg-5">
                        {activeSection === "personal" && (
                            <MyPersonalData user={user} />
                        )}

                        {activeSection === "orders" && <MyOrders />}

                        {activeSection === "addresses" && <MyAddresses />}

                        {activeSection === "password" && <ChangePassword />}
                    </section>

                </div>
            </main>

            <Footer />
        </div>
    );
}

export const AccountContainer = connect(mapStateToProps, mapDispatchToProps)(Account);
