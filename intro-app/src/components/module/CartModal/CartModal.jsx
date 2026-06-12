import "./CartModal.css";
import { HoverButton } from "@components/ui";
import { useSelector, useDispatch } from "react-redux";
import { 
    removeFromCartAsync, 
    updateCartItemAsync, 
    closeCartModal,
    fetchCart,
    updateCartItemLocal
} from "../../../store/cartSlice.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import Quantity from "../../ui/Quantity/Quantity";
import { useLang } from "@hooks/useLang";
import { CiTrash } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { selectCartFullData } from "../../../store/selectors/cartSelectors";

const CartModal = ({ onClose }) => {
    const { getTranslate } = useLang();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, total_price, loading } = useSelector(selectCartFullData);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleRemove = useCallback(async (id) => {
        await dispatch(removeFromCartAsync(id));
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateRooms = useCallback(async (id, newValue) => {
        dispatch(updateCartItemLocal({ id, updates: { rooms_count: newValue } }));
        await dispatch(updateCartItemAsync({ itemId: id, updates: { rooms_count: newValue } }));
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateAdults = useCallback(async (id, newValue) => {
        dispatch(updateCartItemLocal({ id, updates: { adults: newValue } }));
        await dispatch(updateCartItemAsync({ itemId: id, updates: { adults: newValue } }));
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateChildren = useCallback(async (id, newValue) => {
        dispatch(updateCartItemLocal({ id, updates: { children: newValue } }));
        await dispatch(updateCartItemAsync({ itemId: id, updates: { children: newValue } }));
        dispatch(fetchCart());
    }, [dispatch]);

    const handleViewCart = useCallback(() => {
        dispatch(closeCartModal());
        navigate('/cart');
        if (onClose) onClose();
    }, [dispatch, navigate, onClose]);

    const handleCheckout = useCallback(() => {
        dispatch(closeCartModal());
        navigate('/checkout');
        if (onClose) onClose();
    }, [dispatch, navigate, onClose]);

    return (
        <div className="cart__modal" onClick={(e) => e.stopPropagation()}>
            <button className="cart__modal-close" onClick={onClose} aria-label="Close cart">
                <IoClose />
            </button>

            <div className="cart__modal-heading">
                <h2 className="cart__modal-heading-title">
                    {getTranslate("cart", "title")} ({items.length})
                </h2>
            </div>
            
            {loading && items.length === 0 ? (
                <div className="cart__modal-loading">
                    <p>{getTranslate("common", "loading")}</p>
                </div>
            ) : items.length === 0 ? (
                <div className="cart__modal-empty">
                    <p>{getTranslate("cart", "emptyCart")}</p>
                </div>
            ) : (
                <>
                    <ul className="cart__modal-list">
                        {items.map((item) => (
                            <li key={item.id} className="cart__modal-item">
                                <div className="cart__modal-item-wrapper">
                                    <div className="cart__modal-item-container">
                                        <div className="cart__modal-item-media">
                                            <img 
                                                className="cart__modal-item-media-img" 
                                                src={item.room_image || "https://dev24.kodesolution.com/hoexr/wp-content/uploads/woocommerce-placeholder.png"} 
                                                alt={item.room_name} 
                                            />
                                        </div>
                                        <div className="cart__modal-item-container">
                                            <div className="cart__modal-item-content">
                                                <div className="cart__modal-item-heading">
                                                    <h2 className="cart__modal-item-heading-title">
                                                        {item.room_name}
                                                    </h2>
                                                </div>
                                                <div className="cart__modal-item-meta">
                                                    <div className="cart__modal-item-meta-info">
                                                        <span>{getTranslate("cart", "checkIn")}: {item.check_in}</span>
                                                        <span>{getTranslate("cart", "checkOut")}: {item.check_out}</span>
                                                        <span>{item.nights} {item.nights > 1 ? getTranslate("cart", "nights") : getTranslate("cart", "night")}</span>
                                                    </div>
                                                    <div className="cart__modal-item-meta-price">
                                                        <span className="cart__modal-item-meta-price-current">
                                                            ${item.subtotal?.toFixed(2) || '0.00'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cart__modal-item-control">
                                                <div className="cart__modal-item-control-action">
                                                    <Quantity
                                                        variant="small"
                                                        title={getTranslate("cart", "rooms")}
                                                        initial={item.rooms_count}
                                                        min={1}
                                                        max={10}
                                                        onChange={(value) => handleUpdateRooms(item.id, value)}
                                                    />
                                                </div>

                                                <div className="cart__modal-item-control-action">
                                                    <Quantity
                                                        variant="small"
                                                        title={getTranslate("cart", "adults")}
                                                        initial={item.adults}
                                                        min={1}
                                                        max={10}
                                                        onChange={(value) => handleUpdateAdults(item.id, value)}
                                                    />
                                                </div>
                                                <div className="cart__modal-item-control-action">
                                                    <Quantity
                                                        variant="small"
                                                        title={getTranslate("cart", "children")}
                                                        initial={item.children}
                                                        min={0}
                                                        max={10}
                                                        onChange={(value) => handleUpdateChildren(item.id, value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cart__modal-actions">
                                        <div className="cart__modal-action">
                                            <HoverButton onClick={() => handleRemove(item.id)}>
                                                <span className="cart__modal-action-icon">
                                                    <CiTrash />
                                                </span>
                                            </HoverButton>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="cart__modal-total">
                        <span>{getTranslate("cart", "total")}:</span>
                        <span className="cart__modal-total-amount">${total_price?.toFixed(2) || '0.00'}</span>
                    </div>
                    
                    <div className="cart__modal-control">
                        <div className="cart__modal-control-action">
                            <HoverButton onClick={handleViewCart}>
                                {getTranslate("cart", "viewCart")}
                            </HoverButton>
                        </div>
                        <div className="cart__modal-control-action">
                            <HoverButton onClick={handleCheckout}>
                                {getTranslate("checkout", "title")}
                            </HoverButton>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartModal;
