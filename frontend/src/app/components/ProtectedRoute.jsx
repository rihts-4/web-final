import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function ProtectedRoute({ children }) {
    const { initialized } = useUser();
    const token = localStorage.getItem("auth_token");

    if (!initialized) {
        return null;
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
