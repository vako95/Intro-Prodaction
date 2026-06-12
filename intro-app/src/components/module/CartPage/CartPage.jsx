import { Container, HoverButton } from "@components/ui";
import { useState } from "react";
import { FaTrash, FaChevronDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext.jsx";
import { useLang } from "@hooks/useLang";
import "./CartPage.css";

const CartPage = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, getCartTotal, clearCart } = useCart();
    const { getTranslate } = useLang();
    const [couponCode, setCouponCode] = useState("");
    const [isCouponOpen, setIsCouponOpen] = useState(false);

    const handleRemoveItem = (id) => {
        removeFromCart(id);
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <section className="cart-page">
                <Container>
                    <div className="cart-page__container">
                        <div className="cart-page__empty">
                            <h2>{getTranslate("cart", "emptyCart")}</h2>
                            <p>{getTranslate("cart", "addRooms")}</p>
                            <HoverButton
                                variant="silver"
                                onClick={() => navigate('/rooms')}
                            >
                                {getTranslate("cart", "browseRooms")}
                            </HoverButton>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="cart-page">
            <Container>
                <div className="cart-page__container">
                    <div className="cart-page__content">
                        <div className="cart-page__products">
                            <div className="cart-page__header">
                                <h2 className="cart-page__title">{getTranslate("cart", "product")}</h2>
                                <h2 className="cart-page__title cart-page__title--right">{getTranslate("cart", "total")}</h2>
                            </div>

                            <div className="cart-page__items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item__info">
                                            <div className="cart-item__image">
                                                <img src={item.room_image || "https://dev24.kodesolution.com/hoexr/wp-content/uploads/woocommerce-placeholder.png"} alt={item.room_name} />
                                            </div>
                                            <div className="cart-item__details">
                                                <h3 className="cart-item__name">{item.room_name}</h3>
                                                <div className="cart-item__booking-info">
                                                    <p>{getTranslate("cart", "checkIn")}: {item.check_in}</p>
                                                    <p>{getTranslate("cart", "checkOut")}: {item.check_out}</p>
                                                    <p>{getTranslate("cart", "nights")}: {item.nights}</p>
                                                    <p>{getTranslate("cart", "rooms")}: {item.rooms_count}</p>
                                                    <p>{getTranslate("cart", "guests")}: {item.adults} {getTranslate("cart", "adults")}{item.children > 0 ? `, ${item.children} ${getTranslate("cart", "children")}` : ''}</p>
                                                    {item.coupon_code && <p className="cart-item__coupon">{getTranslate("cart", "coupon")}: {item.coupon_code}</p>}
                                                </div>
                                                <p className="cart-item__price">${item.price_per_night.toFixed(2)}/{getTranslate("cart", "night")}</p>
                                                <button
                                                    className="cart-item__remove"
                                                    onClick={() => handleRemoveItem(item.id)}
                                                >
                                                    <FaTrash /> {getTranslate("cart", "remove")}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="cart-item__total">
                                            ${item.total_cost.toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cart-page__summary">
                            <div className="cart-summary">
                                <h3 className="cart-summary__title">{getTranslate("cart", "cartTotals")}</h3>

                                <div className="cart-summary__total">
                                    <span className="cart-summary__total-label">{getTranslate("cart", "estimatedTotal")}</span>
                                    <span className="cart-summary__total-value">
                                        ${getCartTotal().toFixed(2)}
                                    </span>
                                </div>

                                <div className="cart-summary__actions">
                                    <HoverButton
                                        variant="silver"
                                        btnSize="full"
                                        onClick={handleCheckout}
                                    >
                                        {getTranslate("cart", "proceedToCheckout")}
                                    </HoverButton>
                                    <HoverButton
                                        variant="default"
                                        btnSize="full"
                                        onClick={() => navigate('/rooms')}
                                    >
                                        {getTranslate("cart", "continueShopping")}
                                    </HoverButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default CartPage;
