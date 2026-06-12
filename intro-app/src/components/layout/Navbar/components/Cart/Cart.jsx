import "./Cart.css";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CiShoppingCart } from "react-icons/ci";
import ModalContainer from "../../../../ui/ModalContainer/ModalContainer";
import CartModal from "../../../../module/CartModal/CartModal";
import { motion } from "framer-motion";
import { useLang } from "@hooks/useLang";
import { AuthService } from "../../../../../services/auth";
import { fetchCart } from "../../../../../store/cartSlice";
import { selectCartItemsAndTotal } from "../../../../../store/selectors/cartSelectors";

const Cart = ({ showText = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const { items, total_items } = useSelector(selectCartItemsAndTotal);
    const { getTranslate } = useLang();
    const isAuthenticated = AuthService.isAuthenticated();
    const cartCount = total_items || items?.length || 0;

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated]);

    const handleToggleCart = useCallback(() => setIsOpen((prev) => !prev), []);
    const handleCloseCart = useCallback(() => {
        setIsOpen(false);
    }, []);

    useEffect(() => {
        if (isOpen) document.body.classList.add("overflow-hidden");
        else document.body.classList.remove("overflow-hidden");
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="cart">
            <div className="cart__content" onClick={handleToggleCart}>
                <div className={`cart__badge ${showText ? 'cart__badge--with-text' : ''}`}>
                    <span className="cart__badge-icon">
                        <CiShoppingCart />
                    </span>
                    {showText ? (
                        <span className="cart__badge-text">
                            {getTranslate("cart", "items")} ({cartCount})
                        </span>
                    ) : (
                        cartCount > 0 && (
                            <span className="cart__badge-count">{cartCount > 99 ? '99+' : cartCount}</span>
                        )
                    )}
                </div>
            </div>

            <ModalContainer isOpen={isOpen} onClose={handleCloseCart}>
                <motion.div
                    className="cart__panel"
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "tween", duration: 0.3 }}
                >
                    <CartModal onClose={handleCloseCart} />
                </motion.div>
            </ModalContainer>
        </div>
    );
};

export default Cart;
