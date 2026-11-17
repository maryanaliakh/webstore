import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { getCurrentUserThunk } from "../../thunks/auth.ts";

function UserProvider() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getCurrentUserThunk());
    }, [dispatch]);

    return null;
}

export default UserProvider;