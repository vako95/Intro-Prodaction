import { HotelCursor } from "@/components/layout/CursorFX";
import { AppLayout } from "@/components/layout/AppLayout";
import { WishlistProvider } from "../contexts/WishlistContext";
import { CartProvider } from "../context/CartContext";
import { ToastProvider } from "@components/ui/Toast";

import "./App.css";

const App = () => {
    return (
        <HotelCursor speed={0.128} maxStretch={64} stretchFactor={128}>
            <ToastProvider>
                <CartProvider>
                    <WishlistProvider>
                        <AppLayout />
                    </WishlistProvider>
                </CartProvider>
            </ToastProvider>
        </HotelCursor>
    );
}

export default App;
