import { Navigate } from "react-router-dom";
import { AuthService } from "../../services/auth";

const GuestGuard = ({ children }) => {
    const isAuthenticated = AuthService.isAuthenticated();

    if (isAuthenticated) {
        return <Navigate to="/profile" replace />;
    }

    return children;
};

export default GuestGuard;
