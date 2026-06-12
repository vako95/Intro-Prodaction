import { Container, HoverButton, Select } from "@components/ui";
import { useState, useEffect } from "react";
import { FaChevronDown, FaArrowLeft, FaCreditCard, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { CheckoutApi } from "@src/api/modules/checkout";
import { CouponApi } from "@src/api/modules/coupon";
import { fetchCart, clearCartAsync } from "@src/store/cartSlice";
import { useLang } from "@hooks/useLang";
import { selectCartItemsAndPrice } from "@src/store/selectors/cartSelectors";
import "./CheckoutPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_your_publishable_key_here");

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: cartItems, total_price } = useSelector(selectCartItemsAndPrice);
    const { getTranslate } = useLang();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [processingPayment, setProcessingPayment] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        country: "United States (US)",
        firstName: "",
        lastName: "",
        address: "",
        apartment: "",
        city: "",
        state: "California",
        zipCode: "",
        phone: ""
    });

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState(null);
    const [isCouponOpen, setIsCouponOpen] = useState(false);
    const [addNote, setAddNote] = useState(false);
    const [orderNote, setOrderNote] = useState("");

    useEffect(() => {
        queueMicrotask(() => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                if (user.email) {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || "",
                        firstName: user.first_name || "",
                        lastName: user.last_name || "",
                        phone: user.phone || "",
                    }));
                }
            } catch (e) {
            }
        });
    }, []);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError(getTranslate("checkout", "enterCode"));
            return;
        }

        try {
            setCouponLoading(true);
            setCouponError(null);
            const response = await CouponApi.validate(couponCode, total_price);

            if (response.success && response.data) {
                setAppliedCoupon({
                    code: response.data.coupon.code,
                    discount_type: response.data.coupon.discount_type,
                    discount_value: response.data.coupon.discount_value,
                    discount_amount: response.data.discount_amount,
                });
                setCouponError(null);
            } else {
                setCouponError(response.message || getTranslate("checkout", "invalidCoupon"));
                setAppliedCoupon(null);
            }
        } catch (err) {
            setCouponError(err.response?.data?.message || getTranslate("checkout", "invalidCoupon"));
            setAppliedCoupon(null);
        } finally {
            setCouponLoading(false);
        }
    };

    const calculateDiscount = () => {
        if (!appliedCoupon) return 0;
        return appliedCoupon.discount_amount || 0;
    };

    const discount = calculateDiscount();
    const finalTotal = Math.max(0, total_price - discount);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (cartItems.length === 0) {
            setError(getTranslate("checkout", "cartEmpty"));
            return;
        }

        if (!formData.email || !formData.firstName || !formData.lastName) {
            setError(getTranslate("checkout", "fillRequiredFields"));
            return;
        }

        try {
            setLoading(true);
            setProcessingPayment(true);
            setError(null);

            const orderData = {
                coupon_code: appliedCoupon?.code || "",
                notes: orderNote || "",
            };

            const order = await CheckoutApi.createOrder(orderData);
            const paymentIntent = await CheckoutApi.createPaymentIntent({
                order_id: order.id,
            });

            const isFakeStripe = paymentIntent.payment_intent_id?.startsWith('pi_fake');
            let confirmedPaymentId = paymentIntent.payment_intent_id;

            if (isFakeStripe) {
                const cardElement = elements.getElement(CardElement);
                if (!cardElement || !cardElement._complete) {
                    throw new Error(getTranslate("checkout", "enterValidCard"));
                }
            } else {
                const cardElement = elements.getElement(CardElement);
                const { error: stripeError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
                    paymentIntent.client_secret,
                    {
                        payment_method: {
                            card: cardElement,
                            billing_details: {
                                name: `${formData.firstName} ${formData.lastName}`,
                                email: formData.email,
                                phone: formData.phone,
                                address: {
                                    line1: formData.address,
                                    line2: formData.apartment,
                                    city: formData.city,
                                    state: formData.state,
                                    postal_code: formData.zipCode,
                                    country: "US",
                                },
                            },
                        },
                    }
                );

                if (stripeError) {
                    throw new Error(stripeError.message);
                }

                confirmedPaymentId = confirmedPayment.id;
            }

            await CheckoutApi.confirmPayment({
                payment_intent_id: confirmedPaymentId,
                order_id: order.id,
            });

            await dispatch(clearCartAsync());
            navigate(`/order-success?order=${order.order_number}`);

        } catch (err) {
            let errorMessage = getTranslate("checkout", "failedToPlaceOrder");

            if (err.response?.data?.detail) {
                errorMessage = err.response.data.detail;

                if (errorMessage.includes('Stripe API key') || errorMessage.includes('Invalid Stripe')) {
                    errorMessage = getTranslate("checkout", "paymentSystemNotConfigured");
                }
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
            setProcessingPayment(false);
        }
    };

    const countries = [
        { value: "United States (US)" },
        { value: "United Kingdom (UK)" },
        { value: "Canada" },
        { value: "Australia" }
    ];

    const states = [
        { value: "California" },
        { value: "Alabama" },
        { value: "Alaska" },
        { value: "Arizona" },
        { value: "Arkansas" }
    ];

    const cardElementOptions = {
        style: {
            base: {
                fontSize: '14px',
                color: '#424770',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            },
            invalid: {
                color: '#9e2146',
            },
        },
        hidePostalCode: true,
        placeholder: '',
    };

    return (
        <section className="checkout-page">
            <Container>
                <div className="checkout-page__container">
                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(255, 0, 0, 0.1)',
                            color: 'red',
                            padding: '15px',
                            borderRadius: '4px',
                            marginBottom: '20px'
                        }}>
                            {error}
                        </div>
                    )}

                    {cartItems.length === 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '40px',
                            backgroundColor: 'rgba(170, 132, 83, 0.1)',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}>
                            <p>{getTranslate("checkout", "cartEmpty")}. <Link to="/rooms" style={{ color: '#aa8453' }}>{getTranslate("cart", "browseRooms")}</Link></p>
                        </div>
                    )}

                    <form onSubmit={handlePlaceOrder}>
                        <div className="checkout-page__content">
                            <div className="checkout-page__form">
                                <div className="checkout-section">
                                    <h2 className="checkout-section__title">{getTranslate("checkout", "contactInformation")}</h2>
                                    <div className="checkout-form">
                                        <div className="checkout-form__field">
                                            <input
                                                type="email"
                                                className="checkout-input"
                                                placeholder={getTranslate("checkout", "emailAddress")}
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="checkout-section">
                                    <h2 className="checkout-section__title">{getTranslate("checkout", "billingAddress")}</h2>
                                    <div className="checkout-form">
                                        <div className="checkout-form__field">
                                            <label className="checkout-label">{getTranslate("checkout", "countryRegion")}</label>
                                            <Select
                                                title={formData.country}
                                                item={countries}
                                                onChange={(value) => handleInputChange('country', value)}
                                            />
                                        </div>

                                        <div className="checkout-form__row">
                                            <div className="checkout-form__field">
                                                <input
                                                    type="text"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "firstName")}
                                                    value={formData.firstName}
                                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="checkout-form__field">
                                                <input
                                                    type="text"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "lastName")}
                                                    value={formData.lastName}
                                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="checkout-form__field">
                                            <input
                                                type="text"
                                                className="checkout-input"
                                                placeholder={getTranslate("checkout", "address")}
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                        </div>

                                        <div className="checkout-form__field">
                                            <button
                                                type="button"
                                                className="checkout-apartment-toggle"
                                                onClick={() => handleInputChange('apartment', formData.apartment === '' ? 'show' : '')}
                                            >
                                                {getTranslate("checkout", "addApartment")}
                                            </button>
                                            {formData.apartment !== '' && (
                                                <input
                                                    type="text"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "apartment")}
                                                    value={formData.apartment}
                                                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                                                />
                                            )}
                                        </div>

                                        <div className="checkout-form__row">
                                            <div className="checkout-form__field">
                                                <input
                                                    type="text"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "city")}
                                                    value={formData.city}
                                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                                />
                                            </div>
                                            <div className="checkout-form__field">
                                                <label className="checkout-label">{getTranslate("checkout", "state")}</label>
                                                <Select
                                                    title={formData.state}
                                                    item={states}
                                                    onChange={(value) => handleInputChange('state', value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="checkout-form__row">
                                            <div className="checkout-form__field">
                                                <input
                                                    type="text"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "zipCode")}
                                                    value={formData.zipCode}
                                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                                />
                                            </div>
                                            <div className="checkout-form__field">
                                                <input
                                                    type="tel"
                                                    className="checkout-input"
                                                    placeholder={getTranslate("checkout", "phone")}
                                                    value={formData.phone}
                                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="checkout-section">
                                    <h2 className="checkout-section__title">
                                        <FaCreditCard style={{ marginRight: '10px' }} />
                                        {getTranslate("checkout", "paymentInformation")}
                                    </h2>
                                    <div className="checkout-payment">
                                        <div style={{
                                            padding: '16px 4px',
                                            borderWidth: 'medium',
                                            borderStyle: 'none',
                                            borderColor: 'currentcolor',
                                            borderImage: 'initial',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgb(255, 255, 255)'
                                        }}>
                                            <CardElement options={cardElementOptions} />
                                        </div>
                                        <p className="checkout-payment__description" style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FaLock style={{ color: '#aa8453' }} />
                                            {getTranslate("checkout", "securePayment")}
                                        </p>
                                    </div>
                                </div>

                                <div className="checkout-section">
                                    <label className="checkout-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={addNote}
                                            onChange={(e) => setAddNote(e.target.checked)}
                                        />
                                        <span>{getTranslate("checkout", "addNote")}</span>
                                    </label>
                                    {addNote && (
                                        <textarea
                                            className="checkout-textarea"
                                            placeholder={getTranslate("checkout", "notesAboutOrder")}
                                            value={orderNote}
                                            onChange={(e) => setOrderNote(e.target.value)}
                                            rows={4}
                                        />
                                    )}
                                </div>

                                <div className="checkout-section">
                                    <p className="checkout-terms">
                                        {getTranslate("checkout", "termsAgreement")}{" "}
                                        <span>{getTranslate("checkout", "termsAndConditions")}</span> {getTranslate("checkout", "and")}{" "}
                                        <span>{getTranslate("checkout", "privacyPolicy")}</span>
                                    </p>
                                </div>

                                <div className="checkout-actions">
                                    <Link to="/cart" className="checkout-back">
                                        <FaArrowLeft />
                                        <span>{getTranslate("checkout", "returnToCart")}</span>
                                    </Link>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                                    <HoverButton
                                        bgColor="#aa8453"
                                        hoverBgColor="#8a6a3d"
                                        textColor="#fff"
                                        textHoverColor="#fff"
                                        size="lg"
                                        className="checkout-submit"
                                        type="submit"
                                        disabled={loading || !stripe || cartItems.length === 0}
                                    >
                                        {processingPayment ? getTranslate("checkout", "processingPayment") :
                                            loading ? getTranslate("checkout", "creatingOrder") :
                                                `${getTranslate("checkout", "pay")} $${finalTotal.toFixed(2)}`}
                                    </HoverButton>
                                </div>
                            </div>

                            <div className="checkout-page__summary">
                                <div className="checkout-summary">
                                    <h3 className="checkout-summary__title">{getTranslate("checkout", "orderSummary")}</h3>

                                    <div className="checkout-summary__items">
                                        {cartItems.map(item => (
                                            <div key={item.id} className="checkout-summary__item">
                                                <div className="checkout-summary__item-info">
                                                    <div className="checkout-summary__item-image">
                                                        <img
                                                            src={item.room_image || "/No_image_available.svg.png"}
                                                            alt={item.room_name || "Room"}
                                                        />
                                                        <span className="checkout-summary__item-badge" aria-hidden="true">{item.rooms_count}</span>
                                                    </div>
                                                    <div className="checkout-summary__item-details">
                                                        <h4 className="checkout-summary__item-name">{item.room_name}</h4>
                                                        <p className="checkout-summary__item-price">
                                                            {item.check_in} - {item.check_out} ({item.nights} {getTranslate("cart", "nights")})
                                                        </p>
                                                        <p className="checkout-summary__item-price">
                                                            {item.adults} {getTranslate("cart", "adults")}, {item.children} {getTranslate("cart", "children")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="checkout-summary__item-total">
                                                    ${item.subtotal?.toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="checkout-summary__coupon">
                                        <button
                                            type="button"
                                            className={`checkout-summary__coupon-toggle ${isCouponOpen ? 'active' : ''}`}
                                            onClick={() => setIsCouponOpen(!isCouponOpen)}
                                        >
                                            <span>{getTranslate("checkout", "addCoupons")}</span>
                                            <FaChevronDown className="checkout-summary__coupon-icon" />
                                        </button>
                                        {isCouponOpen && (
                                            <div className="checkout-summary__coupon-form open">
                                                <input
                                                    type="text"
                                                    className="checkout-summary__coupon-input"
                                                    placeholder={getTranslate("checkout", "enterCode")}
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value)}
                                                />
                                                <HoverButton
                                                    variant="gold"
                                                    size="md"
                                                    className="checkout-summary__apply-btn"
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading}
                                                    type="button"
                                                >
                                                    {couponLoading ? "..." : getTranslate("checkout", "apply")}
                                                </HoverButton>
                                            </div>
                                        )}
                                        {couponError && (
                                            <p style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{couponError}</p>
                                        )}
                                        {appliedCoupon && (
                                            <p style={{ color: 'green', fontSize: '14px', marginTop: '5px' }}>
                                                {getTranslate("checkout", "couponApplied")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="checkout-summary__totals">
                                        <div className="checkout-summary__row">
                                            <span className="checkout-summary__label">{getTranslate("checkout", "subtotal")}</span>
                                            <span className="checkout-summary__value">${total_price.toFixed(2)}</span>
                                        </div>
                                        {discount > 0 && (
                                            <div className="checkout-summary__row">
                                                <span className="checkout-summary__label">{getTranslate("checkout", "discount")}</span>
                                                <span className="checkout-summary__value" style={{ color: 'green' }}>-${discount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="checkout-summary__row checkout-summary__row--total">
                                            <span className="checkout-summary__label">{getTranslate("common", "total")}</span>
                                            <span className="checkout-summary__value">${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </section>
    );
};

const CheckoutPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default CheckoutPage;