import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Tooltip } from "react-tooltip";
import { ToastContainer } from "@components/ui/Toast";
import { SplashScreen, Preferences } from "@components/ui";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import router from "@/app/routers/routers.jsx";

const AppLayout = () => {
    const { showSplash } = useAppInitialization();

    return (
        <>
            {showSplash && <SplashScreen isLoading={showSplash} />}
            <div style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
                <ReactQueryDevtools 
                    initialIsOpen={false} 
                    buttonPosition="bottom-left"
                    position="bottom"
                />
                <RouterProvider router={router} />
                <Tooltip id="my-tooltip" float={true} />
                <ToastContainer />
                <Preferences />
            </div>
        </>
    );
};

export default AppLayout;
