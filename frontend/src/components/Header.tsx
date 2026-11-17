import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import type { RootState } from "../store";
import Search from "./search/Search.tsx";
import { usePanels } from "./context/panel/usePanels.ts";
import * as selector from "../selectors/product.ts";
import MenuPanel from "./panels/MenuPanel.tsx";
import { useState } from "react";
import AuthPanel from "../components/panels/AuthPanel.tsx";
import type { Action, ThunkDispatch } from "@reduxjs/toolkit";
import {createUserThunk, loginUserThunk} from "../thunks/auth.ts";
import {startGoogleLogin} from "../api/auth.ts";
import {forgotPasswordThunk} from "../thunks/password.ts";

interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone: string;
    keepSignedIn: boolean;
    newsletterConsent: boolean;
    termsAccepted: boolean;
}

const mapStateToProps = (state: RootState) => ({
    cartCount: state.cart.items.reduce((total, item) => total + item.quantity, 0),
    filters: selector.productFilterSelector(state),
    user: state.user.data
});

const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, void, Action>) => ({
    registerUser: (data: RegisterData) => dispatch(createUserThunk(data)),
    loginUser: (email: string, password: string, rememberMe: boolean) => dispatch(loginUserThunk({ email, password, rememberMe })),
    forgotPassword: (email: string) => dispatch(forgotPasswordThunk(email))
});

type HeaderProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

function Header({ cartCount, filters, user, registerUser, loginUser, forgotPassword }: HeaderProps) {
    const navigate = useNavigate();
    const { activePanel, togglePanel, closePanel, isSearchOpen, openSearch, closeSearch } = usePanels();
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    return (
        <header className="sticky-top bg-white border-bottom">
            <div className="container-fluid px-4">
                <div className="row align-items-center" style={{ height: 53 }}>
                    <div className="col-auto me-4">
                        <h3 className="fw-bold mb-0" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            BUBBLE
                        </h3>
                    </div>

                    <div className="col-auto">
                        <div className="d-flex gap-4">
                            <button
                                onClick={() => togglePanel("women")}
                                className={`nav-gender-btn ${(activePanel === "women" || (activePanel !== "men" && filters.gender === "women")) ? "active" : ""} small text-dark text-decoration-none border-0 bg-transparent`}
                            >
                                WOMEN
                            </button>

                            <button
                                onClick={() => togglePanel("men")}
                                className={`nav-gender-btn ${(activePanel === "men" || (activePanel !== "women" && filters.gender === "men")) ? "active" : ""} small text-dark text-decoration-none border-0 bg-transparent`}
                            >
                                MEN
                            </button>

                        </div>
                    </div>

                    <div className="col-auto ms-auto">
                        <div className="d-flex align-items-center gap-4">

                            {user ? (
                                <div className="d-flex align-items-center gap-3">
                                    <div className="nav-gender-btn d-flex align-items-center gap-2 small text-dark fw-semibold"
                                         onClick={() => {
                                             closePanel();
                                             closeSearch();
                                             navigate("/account");
                                         }}
                                         style={{ cursor: "pointer" }}
                                    >
                                        <i className="bi bi-stars fs-5" style={{ color: "#FF6B35" }}></i>
                                        {user.name.toUpperCase()}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="nav-gender-btn d-flex align-items-center gap-2 small text-dark"
                                    onClick={() => {
                                        closePanel();
                                        closeSearch();
                                        setIsAuthOpen(true);
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <i className="bi bi-stars fs-5" style={{ color: "#FF6B35" }}></i>
                                    LOG IN
                                </div>
                            )}

                            <div
                                className={`nav-gender-btn d-flex align-items-center gap-2 small text-dark ${window.location.pathname === "/favorites" ? "active" : ""}`}
                                onClick={() => { closePanel(); navigate("/favorites"); }}
                                style={{ cursor: "pointer" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path
                                        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"
                                        fill="white"
                                        stroke="black"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                FAVORITES
                            </div>

                            <div
                                className={`nav-gender-btn d-flex align-items-center gap-2 small text-dark ${window.location.pathname === "/cart" ? "active" : ""}`}
                                onClick={() => { closePanel(); navigate("/cart"); }}
                                style={{ cursor: "pointer" }}
                            >
                                <span className="position-relative">
                                    <i className="bi bi-bag fs-6"></i>
                                    {cartCount > 0 && (
                                        <span
                                            className="position-absolute text-white rounded-circle d-flex align-items-center justify-content-center"
                                            style={{
                                                top: -8,
                                                right: -10,
                                                minWidth: 17,
                                                height: 17,
                                                padding: "0 4px",
                                                fontSize: 9,
                                                background: "black"
                                            }}
                                        >
                                            {cartCount}
                                        </span>
                                    )}
                                </span>
                                    BAG
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Search
                open={isSearchOpen}
                onClose={closeSearch}
            />

            <AuthPanel
                open={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onLogin={async (email, password, rememberMe) => {
                    try {
                        await loginUser(email, password, rememberMe);
                        setIsAuthOpen(false);
                    } catch (error) {
                        alert(error instanceof Error ? error.message : "Login failed");
                    }
                }}
                onRegister={async (name, email, password, phone, keepSignedIn, newsletter, terms) => {
                    await registerUser({
                        name,
                        email,
                        password,
                        phone: `+48${phone}`,
                        keepSignedIn,
                        newsletterConsent: newsletter,
                        termsAccepted: terms
                    });

                    setIsAuthOpen(false);
                }}
                onForgotPassword={forgotPassword}
                onGoogleLogin={startGoogleLogin}
            />

            <MenuPanel
                open={activePanel === "women" || activePanel === "men"}
                gender={activePanel === "women" ? "women" : "men"}
                onClose={closePanel}
                onOpenSearch={openSearch}
            />
        </header>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
