import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../../hooks/useSettings";

const MaintenanceGuard = ({ children }) => {
    const { data: settings, isLoading } = useSettings();
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        if (!isLoading && settings) {
            const isMaintenanceMode = settings.maintenance_mode === true || settings.maintenance_mode === 'true';
            const isOnMaintenancePage = location.pathname === '/maintenance';
            
            if (isMaintenanceMode && !isOnMaintenancePage) {
                navigate('/maintenance', { replace: true });
            } else if (!isMaintenanceMode && isOnMaintenancePage) {
                navigate('/', { replace: true });
            }
        }
    }, [settings, isLoading, location.pathname, navigate]);
    
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                background: 'linear-gradient(135deg, rgba(10, 9, 8, 1) 0%, rgba(26, 22, 20, 1) 50%, rgba(10, 9, 8, 1) 100%)',
                color: 'rgba(170, 132, 83, 1)',
                fontFamily: '"Gilda Display", sans-serif',
                fontSize: '24px'
            }}>
                Loading...
            </div>
        );
    }

    return children;
};

export default MaintenanceGuard;
