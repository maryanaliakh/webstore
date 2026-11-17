import { useState } from "react";
import type { FormEvent } from "react";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";

interface AuthPanelProps {
    open: boolean;
    onClose: () => void;
    onLogin: (email: string, password: string, rememberMe: boolean) => void;
    onRegister: (
        name: string,
        email: string,
        password: string,
        phone: string,
        keepSignedIn: boolean,
        newsletter: boolean,
        marketing: boolean,
        terms: boolean
    ) => Promise<void>;
    onForgotPassword: (email: string) => Promise<void>;
    onGoogleLogin: () => void;
}

export default function AuthPanel({open, onClose, onLogin, onRegister, onForgotPassword, onGoogleLogin}: AuthPanelProps) {
    const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [keepSignedIn, setKeepSignedIn] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [marketing, setMarketing] = useState(false);
    const [terms, setTerms] = useState(false);

    const [registerError, setRegisterError] = useState("");
    const [forgotMessage, setForgotMessage] = useState("");

    if (!open) return null;

    const handleLogin = (e: FormEvent<HTMLFormElement>, rememberMe: boolean) => {
        e.preventDefault();
        onLogin(email, password, rememberMe);
    };

    const handleRegister = async (e: FormEvent<HTMLFormElement>, keepSignedIn: boolean) => {
        e.preventDefault();
        setRegisterError("");

        try {
            await onRegister(name, email, password, phone, keepSignedIn, newsletter, marketing, terms);
        } catch (error) {
            setRegisterError(error instanceof Error ? error.message : "Registration failed");
        }
    };

    const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setForgotMessage("");

        try {
            await onForgotPassword(email);
            setForgotMessage("If an account with this email exists, you will receive password reset instructions.");
        } catch {
            setForgotMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <>
            <div className="auth-overlay open" onClick={onClose} />

            <div className="auth-panel open" role="dialog" aria-modal="true">
                <div className="w-100">
                    {mode === "login" && (
                        <Login
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            rememberMe={rememberMe}
                            setRememberMe={setRememberMe}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            onLogin={handleLogin}
                            onGoogleLogin={onGoogleLogin}
                            onForgotPassword={() => setMode("forgot")}
                            onRegister={() => setMode("register")}
                            onClose={onClose}

                        />
                    )}

                    {mode === "register" && (
                        <Register
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            name={name}
                            setName={setName}
                            phone={phone}
                            setPhone={setPhone}
                            keepSignedIn={keepSignedIn}
                            setKeepSignedIn={setKeepSignedIn}
                            newsletter={newsletter}
                            setNewsletter={setNewsletter}
                            marketing={marketing}
                            setMarketing={setMarketing}
                            terms={terms}
                            setTerms={setTerms}
                            registerError={registerError}
                            onRegister={handleRegister}
                            onLogin={() => setMode("login")}
                        />
                    )}

                    {mode === "forgot" && (
                        <ForgotPassword
                            email={email}
                            setEmail={setEmail}
                            forgotMessage={forgotMessage}
                            onSubmit={handleForgotPassword}
                            onBack={() => setMode("login")}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
