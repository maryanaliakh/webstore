
import type { FormEvent } from "react";

interface ForgotPasswordProps {
    email: string;
    setEmail: (value: string) => void;
    forgotMessage: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

export default function ForgotPasswordForm({email, setEmail, forgotMessage, onSubmit, onBack}: ForgotPasswordProps) {
    return (
        <>
            <button type="button" className="auth-back" onClick={onBack} aria-label="Back to login">
                <i className="bi bi-arrow-left" />
            </button>

            <h5 className="text-center mb-3 fw-semibold">
                FORGOT YOUR PASSWORD?
            </h5>

            <p className="text-center mb-4 small">
                We'll send you an email with instructions on how to reset your password.
            </p>

            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    className="form-control mb-3 rounded-0 py-3"
                    placeholder="EMAIL"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <button type="submit" className="btn btn-dark w-100 mb-3 rounded-0 btn-sm px-3 py-3">
                    RESET PASSWORD
                </button>
            </form>

            {forgotMessage && (
                <p className="text-success small text-center mt-3">
                    {forgotMessage}
                </p>
            )}
        </>
    );
}
