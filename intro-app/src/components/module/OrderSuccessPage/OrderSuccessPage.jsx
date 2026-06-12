import { Container, HoverButton } from "@components/ui";
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaArrowRight, FaCalendarAlt, FaUsers, FaBed, FaMoon } from "react-icons/fa";
import { useState, useEffect } from "react";
import { CheckoutApi } from "@src/api/modules/checkout";
import { motion } from "framer-motion";
import { useLang } from "@hooks/useLang";
import "./OrderSuccessPage.css";

const OrderSuccessPage = () => {
    const { getTranslate } = useLang();
    const [searchParams] = useSearchParams();
    const orderNumber = searchParams.get('order');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderNumber) {
                setError(getTranslate("orderSuccess", "noOrderNumber"));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await CheckoutApi.getOrderDetail(orderNumber);
                setOrderData(data);
                setError(null);
            } catch (err) {
                setError(getTranslate("orderSuccess", "failedToLoadOrder"));
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderNumber, getTranslate]);

    if (loading) {
        return (
            <section className="order-success">
                <Container>
                    <div className="order-success__loading">
                        <div className="order-success__spinner"></div>
                        <p>{getTranslate("orderSuccess", "loadingBookingDetails")}</p>
                    </div>
                </Container>
            </section>
        );
    }

    if (error || !orderData) {
        return (
            <section className="order-success">
                <Container>
                    <div className="order-success__error">
                        <div className="order-success__error-icon">⚠️</div>
                        <h2>{getTranslate("orderSuccess", "orderNotFound")}</h2>
                        <p>{error || getTranslate("orderSuccess", "couldNotFindOrder")}</p>
                        <Link to="/rooms">
                            <HoverButton variant="gold" size="lg">
                                {getTranslate("orderSuccess", "browseRooms")}
                            </HoverButton>
                        </Link>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section className="order-success">
            <Container>
                <motion.div 
                    className="order-success__wrapper"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="order-success__header">
                        <motion.div 
                            className="order-success__icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        >
                            <FaCheckCircle />
                        </motion.div>
                        <h1 className="order-success__title">{getTranslate("orderSuccess", "bookingConfirmed")}</h1>
                        <p className="order-success__subtitle">
                            {getTranslate("orderSuccess", "reservationConfirmed")}
                        </p>
                        <div className="order-success__order-number">
                            {getTranslate("orderSuccess", "orderNumber")} #{orderData.order_number}
                        </div>
                    </div>

                    <div className="order-success__content">
                        {/* Main Content */}
                        <div className="order-success__main">
                            {/* Booking Summary */}
                            <div className="booking-summary">
                                <div className="booking-summary__header">
                                    <h2 className="booking-summary__title">{getTranslate("orderSuccess", "bookingSummary")}</h2>
                                    <div className="booking-summary__status">
                                        <span className={`status-badge status-badge--${orderData.payment_status}`}>
                                            {orderData.payment_status === 'paid' ? getTranslate("orderSuccess", "paid") : orderData.payment_status}
                                        </span>
                                    </div>
                                </div>

                                {/* Room Items */}
                                <div className="booking-items">
                                    {orderData.items.map((item, index) => (
                                        <motion.div 
                                            key={item.id} 
                                            className="booking-item"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <div className="booking-item__image">
                                                <img 
                                                    src={item.room_image || "/No_image_available.svg.png"} 
                                                    alt={item.room_title}
                                                />
                                                <div className="booking-item__badge">{item.rooms_count}x</div>
                                            </div>
                                            
                                            <div className="booking-item__details">
                                                <h3 className="booking-item__name">{item.room_title}</h3>
                                                
                                                <div className="booking-item__info">
                                                    <div className="booking-item__info-row">
                                                        <FaCalendarAlt className="booking-item__icon" />
                                                        <span>
                                                            {new Date(item.check_in).toLocaleDateString('en-US', { 
                                                                month: 'short', 
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })} - {new Date(item.check_out).toLocaleDateString('en-US', { 
                                                                month: 'short', 
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="booking-item__info-row">
                                                        <FaMoon className="booking-item__icon" />
                                                        <span>{item.nights} {item.nights === 1 ? getTranslate("orderSuccess", "night") : getTranslate("orderSuccess", "nights")}</span>
                                                    </div>
                                                    
                                                    <div className="booking-item__info-row">
                                                        <FaUsers className="booking-item__icon" />
                                                        <span>{item.adults} {item.adults === 1 ? getTranslate("orderSuccess", "adult") : getTranslate("orderSuccess", "adults")}, {item.children} {item.children === 1 ? getTranslate("orderSuccess", "child") : getTranslate("orderSuccess", "children")}</span>
                                                    </div>
                                                    
                                                    <div className="booking-item__info-row">
                                                        <FaBed className="booking-item__icon" />
                                                        <span>{item.rooms_count} {item.rooms_count === 1 ? getTranslate("orderSuccess", "room") : getTranslate("orderSuccess", "rooms")}</span>
                                                    </div>
                                                </div>

                                                <div className="booking-item__pricing">
                                                    <span className="booking-item__price-label">
                                                        ${Number(item.price_per_night).toFixed(2)} × {item.nights} nights × {item.rooms_count} room(s)
                                                    </span>
                                                    <span className="booking-item__price-total">
                                                        ${Number(item.subtotal).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Notes */}
                                {orderData.notes && (
                                    <div className="booking-notes">
                                        <h4 className="booking-notes__title">{getTranslate("orderSuccess", "specialRequests")}</h4>
                                        <p className="booking-notes__text">{orderData.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="order-success__sidebar">
                            {/* Price Breakdown */}
                            <motion.div 
                                className="price-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="price-card__title">{getTranslate("orderSuccess", "paymentSummary")}</h3>
                                
                                <div className="price-card__rows">
                                    <div className="price-card__row">
                                        <span className="price-card__label">{getTranslate("orderSuccess", "subtotal")}</span>
                                        <span className="price-card__value">${Number(orderData.total_amount).toFixed(2)}</span>
                                    </div>

                                    {orderData.discount_amount > 0 && (
                                        <>
                                            <div className="price-card__row price-card__row--discount">
                                                <span className="price-card__label">
                                                    {getTranslate("orderSuccess", "discount")} {orderData.coupon_code && `(${orderData.coupon_code})`}
                                                </span>
                                                <span className="price-card__value">-${Number(orderData.discount_amount).toFixed(2)}</span>
                                            </div>
                                        </>
                                    )}

                                    <div className="price-card__divider"></div>

                                    <div className="price-card__row price-card__row--total">
                                        <span className="price-card__label">{getTranslate("orderSuccess", "totalPaid")}</span>
                                        <span className="price-card__value">${Number(orderData.final_amount).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="price-card__status">
                                    <div className="price-card__status-icon">✓</div>
                                    <div>
                                        <div className="price-card__status-title">{getTranslate("orderSuccess", "paymentSuccessful")}</div>
                                        <div className="price-card__status-text">
                                            {getTranslate("orderSuccess", "paidOn")} {new Date(orderData.created_at).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Booking Info */}
                            <motion.div 
                                className="info-card"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="info-card__title">{getTranslate("orderSuccess", "whatsNext")}</h3>
                                <div className="info-card__content">
                                    <p className="info-card__text">
                                        {getTranslate("orderSuccess", "confirmationEmailSent")}
                                    </p>
                                    <p className="info-card__text">
                                        {getTranslate("orderSuccess", "manageBooking")}
                                    </p>
                                </div>
                                <Link to="/profile" className="info-card__link">
                                    {getTranslate("orderSuccess", "viewMyBookings")} <FaArrowRight />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Actions */}
                    <motion.div 
                        className="order-success__actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link to="/rooms">
                            <HoverButton
                                bgColor="transparent"
                                hoverBgColor="rgba(170, 132, 83, 0.1)"
                                textColor="#aa8453"
                                textHoverColor="#aa8453"
                                size="lg"
                                style={{ border: '2px solid #aa8453' }}
                            >
                                {getTranslate("orderSuccess", "browseMoreRooms")}
                            </HoverButton>
                        </Link>
                        <Link to="/">
                            <HoverButton
                                bgColor="#aa8453"
                                hoverBgColor="#8a6a3d"
                                textColor="#fff"
                                textHoverColor="#fff"
                                size="lg"
                            >
                                {getTranslate("orderSuccess", "backToHome")}
                            </HoverButton>
                        </Link>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
};

export default OrderSuccessPage;
