import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { getCurrentUserThunk } from "../../thunks/auth";
import { completeGoogleLogin } from "../../api/auth";

function GoogleCallback() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const completeLogin = async () => {
            try {
                await completeGoogleLogin();
                await dispatch(getCurrentUserThunk());
                window.location.replace("/");
            } catch (error) {
                console.error("Google login error:", error);
                window.location.replace("/");
            }
        };

        completeLogin();
    }, [dispatch]);

    return <div>Signing in with Google...</div>;
}

export default GoogleCallback;