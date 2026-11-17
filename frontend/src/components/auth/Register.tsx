
import type { FormEvent } from "react";

interface RegisterProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    name: string;
    setName: (value: string) => void;
    phone: string;
    setPhone: (value: string) => void;
    keepSignedIn: boolean;
    setKeepSignedIn: (value: boolean) => void;
    newsletter: boolean;
    setNewsletter: (value: boolean) => void;
    marketing: boolean;
    setMarketing: (value: boolean) => void;
    terms: boolean;
    setTerms: (value: boolean) => void;
    registerError: string;
    onRegister: (e: FormEvent<HTMLFormElement>, keepSignedIn: boolean) => void;
    onLogin: () => void;
}

export default function Register({email, setEmail, password, setPassword, showPassword,
    setShowPassword, name, setName, phone, setPhone, keepSignedIn, setKeepSignedIn, newsletter,
    setNewsletter, marketing, setMarketing, terms, setTerms, registerError, onRegister, onLogin}: RegisterProps) {
    return (
        <>
            <button type="button" className="auth-back" onClick={onLogin} aria-label="Back to login">
                <i className="bi bi-arrow-left" />
            </button>

            <h5 className="text-center mb-5 fw-semibold">
                CREATE YOUR BUBBLE ACCOUNT
            </h5>

            <form onSubmit={e => onRegister(e, keepSignedIn)}>
                <input
                    type="text"
                    className="form-control mb-3 rounded-0 py-3"
                    placeholder="FULL NAME"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={100}
                    required
                />

                <input
                    type="email"
                    className="form-control mb-3 rounded-0 py-3"
                    placeholder="EMAIL"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <div className="position-relative mb-3">
                    <input
                        type={showPassword ? "text" : "password"}
                        className="form-control rounded-0 py-3"
                        placeholder="PASSWORD"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        minLength={8}
                        required
                    />

                    <button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                </div>

                <label className="form-label small fw-semibold">PHONE NUMBER</label>

                <div className="d-flex gap-2 mb-2">
                    <div className="auth-country-code d-flex align-items-center justify-content-center">
                        +48
                    </div>

                    <input
                        type="tel"
                        className="form-control rounded-0 py-3"
                        placeholder="PHONE NUMBER"
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                        pattern="[0-9]{9}"
                        minLength={9}
                        maxLength={9}
                        required
                    />
                </div>

                <p className="small mb-4">
                    We'll send you an SMS to verify your phone number and link it to your account.
                </p>

                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="keepSignedIn"
                        checked={keepSignedIn}
                        onChange={e => setKeepSignedIn(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="keepSignedIn">
                        Keep me signed in
                    </label>
                </div>

                <div className="mb-3">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="newsletter"
                            checked={newsletter}
                            onChange={e => setNewsletter(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="newsletter">
                            I want to receive updates about new arrivals and personalized marketing communications from BUBBLE via email and other channels.
                        </label>
                    </div>
                </div>

                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="marketingTerms"
                        checked={marketing}
                        onChange={e => setMarketing(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="marketingTerms">
                        I agree to receive marketing communications from BUBBLE.
                    </label>
                </div>

                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="terms"
                        checked={terms}
                        onChange={e => setTerms(e.target.checked)}
                        required
                    />
                    <label className="form-check-label" htmlFor="terms">
                        I have read and agree to the{" "}
                        <a href="#" className="auth-text-link">Terms of Use and Purchase</a>
                        {" "}and understand how my personal data is used, as explained in the{" "}
                        <a href="#" className="auth-text-link">Privacy Policy</a>.
                    </label>
                </div>

                {registerError && (
                    <p className="text-danger small mb-3">{registerError}</p>
                )}

                <button type="submit" className="btn btn-dark w-100 mb-3 rounded-0 btn-sm px-3 py-3">
                    CREATE ACCOUNT
                </button>
            </form>

            <div className="text-center small pt-5">
                ALREADY HAVE AN ACCOUNT?{" "}
                <button type="button" onClick={onLogin} className="btn fw-semibold px-0 mb-1">
                    <span className="small">LOG IN</span>
                </button>
            </div>
        </>
    );
}
