import {useState} from "react";

function ChangePassword() {
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const updateField = (field: keyof typeof form, value: string) => {
        setForm(prev => ({...prev, [field]: value}));
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
            setError("Please complete all fields");
            return;
        }

        if (form.newPassword.length < 8) {
            setError("New password must contain at least 8 characters");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/user/change-password", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Could not change password");
            }

            setSuccess("Your password has been changed successfully");
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        }
    };

    const inputClass = "form-control rounded-0 p-3 mb-3";

    return (
        <div className="w-100 text-dark pt-3">

            <form onSubmit={handleSubmit} className="mx-auto" style={{maxWidth: "500px"}}>
                <input
                    type="password"
                    className={inputClass}
                    placeholder="CURRENT PASSWORD"
                    value={form.currentPassword}
                    onChange={e => updateField("currentPassword", e.target.value)}
                />

                <input
                    type="password"
                    className={inputClass}
                    placeholder="NEW PASSWORD"
                    value={form.newPassword}
                    onChange={e => updateField("newPassword", e.target.value)}
                />

                <input
                    type="password"
                    className={inputClass}
                    placeholder="CONFIRM NEW PASSWORD"
                    value={form.confirmPassword}
                    onChange={e => updateField("confirmPassword", e.target.value)}
                />

                {error && (
                    <div className="text-danger small mb-3">{error}</div>
                )}

                {success && (
                    <div className="text-success small mb-3">{success}</div>
                )}

                <button type="submit" className="btn btn-dark rounded-0 py-3 px-4 w-100">
                    <span className="small">UPDATE PASSWORD</span>
                </button>
            </form>
        </div>
    );
}

export default ChangePassword;