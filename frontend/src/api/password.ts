export async function forgotPassword(email: string) {
    const response = await fetch("http://localhost:3000/api/auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Password reset request failed");
    }

    return result;
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch("http://localhost:3000/api/user/change-password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({currentPassword, newPassword})
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Password change failed");
    }

    return result;
}