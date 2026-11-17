
import type { FormEvent } from "react";

interface LoginProps {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    rememberMe: boolean;
    setRememberMe: (value: boolean) => void;
    showPassword: boolean;
    setShowPassword: (value: boolean) => void;
    onLogin: (e: FormEvent<HTMLFormElement>, rememberMe: boolean) => void;
    onGoogleLogin: () => void;
    onForgotPassword: () => void;
    onRegister: () => void;
    onClose: () => void;

}

export default function Login({email, setEmail, password, setPassword, rememberMe,
   setRememberMe, showPassword, setShowPassword, onLogin, onForgotPassword, onRegister, onClose, onGoogleLogin}: LoginProps) {
    return (
        <>
            <button className="auth-close" onClick={onClose} aria-label="Close">
                <i className="bi bi-x-lg" />
            </button>

            <h5 className="text-center mb-3 fw-semibold">
                LOG IN OR CREATE AN ACCOUNT
            </h5>

            <p className="text-center mb-4 small">
                Sign in to your BUBBLE account to enjoy a personalized shopping experience.
            </p>

            <form onSubmit={e => onLogin(e, rememberMe)}>
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
                        required
                    />

                    <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                </div>

                <button type="button" className="btn px-0 mb-3" onClick={onForgotPassword}>
                    <span className="small fw-semibold">FORGOT PASSWORD?</span>
                </button>

                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={e => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                        Keep me signed in
                    </label>
                </div>

                <button type="submit" className="btn btn-dark w-100 mb-3 rounded-0 btn-sm px-3 py-3">
                    LOG IN
                </button>
            </form>

            <button
                type="button"
                className="btn btn-light w-100 rounded-0 py-3"
                onClick={onGoogleLogin}
            >
                <svg className="me-2 mb-1" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.45 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.27 5.64c4.25-3.92 6.69-9.7 6.69-17.29z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.47 0 11.92-2.13 15.89-5.79l-7.27-5.64c-2.02 1.36-4.6 2.17-8.62 2.17-6.26 0-11.55-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span className="small" >CONTINUE WITH GOOGLE</span>
            </button>

            <div className="text-center small pt-5">
                DON'T HAVE AN ACCOUNT?{" "}
                <button type="button" onClick={onRegister} className="btn fw-semibold px-0 mb-1">
                    <span className="small">CREATE ACCOUNT</span>
                </button>
            </div>
        </>
    );
}
