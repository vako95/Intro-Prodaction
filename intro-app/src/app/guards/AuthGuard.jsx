import { Navigate, useLocation } from "react-router-dom";
import { AuthService } from "../../services/auth";

const AuthGuard = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = AuthService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AuthGuard;
