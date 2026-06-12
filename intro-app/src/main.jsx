import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { store } from "./store/store.js";
import './assets/css/index.css';
import App from './app/App.jsx';
import { Provider } from "react-redux"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LangContextProvider } from "./context/lang.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },
    },
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <LangContextProvider>
                    <App />
                </LangContextProvider>
            </QueryClientProvider>
        </Provider>
    </StrictMode>
)
