import { useState, useEffect, useMemo } from "react";
import { TfiLineDashed } from "react-icons/tfi";
import { MdOutlineDiscount } from "react-icons/md";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCartAsync, fetchCart } from "../../../../../../../store/cartSlice.js";
import dayjs from "dayjs";
import { useLang } from "@hooks/useLang";

import "./RoomDetailsRight.css";
import { HoverButton, BookingFrame, BookingFrameInput, Calendar, Quantity, Input } from "@components/ui";

import { useCalendarControl } from "@hooks";
import { useRoomBySlug } from "../../../../../../../hooks/useAPI.js";
import { useCoupon } from "../../../../../../../hooks/useCoupon.js";

const RoomDetailsRight = () => {
    const { slug } = useParams();
    const { getTranslate } = useLang();
    
    const location = useLocation();
    const dispatch = useDispatch();


    const bookingParams = location.state?.bookingParams || {};

    const [range, setRange] = useState({
        from: bookingParams.check_in ? dayjs(bookingParams.check_in).toDate() : undefined,
        to: bookingParams.check_out ? dayjs(bookingParams.check_out).toDate() : undefined
    });
    const [rooms, setRooms] = useState(bookingParams.rooms_count || 1);
    const [adults, setAdults] = useState(bookingParams.adults || 1);
    const [children, setChildren] = useState(bookingParams.children || 0);
    const [couponCode, setCouponCode] = useState("");

    const { data: roomData, isLoading: roomLoading, error: roomError } = useRoomBySlug(slug);
    const { appliedCoupon, couponError, isValidating, applyCoupon, removeCoupon } = useCoupon();

    const { ref, isOpen, toggleDropdown } = useCalendarControl();

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const priceCalculation = useMemo(() => {
        if (!range.from || !range.to) {
            return null;
        }

        const nights = dayjs(range.to).diff(dayjs(range.from), 'day');
        const pricePerNight = roomData?.price || 100; // Дефолтная цена если нет данных
        const basePrice = pricePerNight * nights;
        const totalBasePrice = basePrice * rooms;

        let discount = 0;
        if (appliedCoupon) {
            discount = appliedCoupon.discount_amount || 0;
        }

        const totalCost = totalBasePrice - discount;

        return {
            nights,
            pricePerNight,
            basePrice,
            totalBasePrice,
            discount,
            totalCost
        };
    }, [range, rooms, roomData, appliedCoupon]);

    const handleSelectRange = (newRange) => {
        if (!newRange) return;
        
        const normalizedRange = {
            from: newRange.from ? new Date(newRange.from.getFullYear(), newRange.from.getMonth(), newRange.from.getDate()) : null,
            to: newRange.to ? new Date(newRange.to.getFullYear(), newRange.to.getMonth(), newRange.to.getDate()) : null
        };
        
        setRange(normalizedRange);
        if (appliedCoupon) {
            removeCoupon();
        }
    };

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) return;

        if (priceCalculation && roomData) {
            applyCoupon(couponCode, priceCalculation.totalBasePrice, roomData.id);
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        setCouponCode("");
    };

    const handleBooking = async (e) => {
        e.preventDefault();

        if (range.from && range.to && roomData && priceCalculation) {
            const room = roomData;
            const cartData = {
                room_id: room.id,
                check_in: dayjs(range.from).format('YYYY-MM-DD'),
                check_out: dayjs(range.to).format('YYYY-MM-DD'),
                adults: adults,
                children: children,
                rooms_count: rooms
            };

            try {
                await dispatch(addToCartAsync(cartData)).unwrap();
                
                await dispatch(fetchCart());
                removeCoupon();
            } catch (error) {
            }
        }
    };

    return (
        <article className="rooms-details__column rooms-details__columns--right">
            <div className="rooms-details__booking">
                <div className="rooms-details__booking-frame">
                    <BookingFrame heading={true}>
                        <div className="rooms-details__booking-container" ref={ref}>
                            <div className="rooms-details__booking-content" onClick={() => toggleDropdown("calendar")}>
                                <div className="rooms-details__booking-wrapper">
                                    <div className="rooms-details__booking-field">
                                        <BookingFrameInput
                                            title={getTranslate("booking", "checkIn")}
                                            onChange={handleSelectRange}
                                            value={range.from ? formatDate(range.from) :
                                                <span className="rooms-details__booking-icon">
                                                    <TfiLineDashed />
                                                </span>
                                            }
                                            isOpen={isOpen === "calendar"}
                                        />
                                    </div>
                                    {isOpen === "calendar" && (
                                        <div className="rooms-details__booking-calendar">
                                            <Calendar months={1} range={range} setRange={handleSelectRange} />
                                        </div>
                                    )}
                                </div>
                                <div className="rooms-details__booking-wrapper">
                                    <div className="rooms-details__booking-field">
                                        <BookingFrameInput
                                            title={getTranslate("booking", "checkOut")}
                                            onChange={handleSelectRange}
                                            value={range.to ? formatDate(range.to) :
                                                <span className="rooms-details__booking-icon">
                                                    <TfiLineDashed />
                                                </span>
                                            }
                                            isOpen={isOpen === "calendar"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="rooms-details__booking-wrapper">
                                <div className="rooms-details__booking-field" onClick={() => toggleDropdown("rooms")}>
                                    <BookingFrameInput
                                        title={getTranslate("booking", "rooms")}
                                        subtitle={getTranslate("booking", "rooms")}
                                        value={rooms}
                                        isOpen={isOpen === "rooms"}
                                    />
                                    {isOpen === "rooms" && (
                                        <div className="rooms-details__booking-dropdown">
                                            <Quantity
                                                className="rooms-details__booking-dropdown-action"
                                                title={getTranslate("booking", "rooms")}
                                                initial={rooms}
                                                min={1}
                                                max={10}
                                                onChange={(value) => {
                                                    setRooms(value);
                                                    if (appliedCoupon) removeCoupon();
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="rooms-details__booking-wrapper">
                                <div className="rooms-details__booking-field-group">
                                    <div className="rooms-details__booking-field" onClick={() => toggleDropdown("adults")}>
                                        <BookingFrameInput
                                            title={getTranslate("booking", "adults")}
                                            value={adults}
                                            isOpen={isOpen === "adults"}
                                        />

                                        {isOpen === "adults" && (
                                            <div className="rooms-details__booking-dropdown">
                                                <Quantity
                                                    variant="small"
                                                    initial={adults}
                                                    min={1}
                                                    max={10}
                                                    onChange={setAdults}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="rooms-details__booking-field" onClick={() => toggleDropdown("children")}>
                                        <BookingFrameInput
                                            title={getTranslate("booking", "children")}
                                            value={children}
                                            isOpen={isOpen === "children"}
                                        />

                                        {isOpen === "children" && (
                                            <div className="rooms-details__booking-dropdown">
                                                <Quantity
                                                    variant="small"
                                                    initial={children}
                                                    min={0}
                                                    max={10}
                                                    onChange={setChildren}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BookingFrame>
                </div>

                {priceCalculation && (
                    <div className="rooms-details__pricing">
                        <div className="rooms-details__pricing-item">
                            <span className="rooms-details__pricing-label">{getTranslate("roomDetails", "pricePerNight")}:</span>
                            <span className="rooms-details__pricing-value">${priceCalculation.pricePerNight.toFixed(2)}</span>
                        </div>
                        <div className="rooms-details__pricing-item">
                            <span className="rooms-details__pricing-label">{getTranslate("roomDetails", "nights")}:</span>
                            <span className="rooms-details__pricing-value">{priceCalculation.nights}</span>
                        </div>
                        <div className="rooms-details__pricing-item">
                            <span className="rooms-details__pricing-label">{getTranslate("booking", "rooms")}:</span>
                            <span className="rooms-details__pricing-value">{rooms}</span>
                        </div>
                        <div className="rooms-details__pricing-divider" />
                        <div className="rooms-details__pricing-item rooms-details__pricing-item--total">
                            <span className="rooms-details__pricing-label">{getTranslate("roomDetails", "totalBasePrice")}:</span>
                            <span className="rooms-details__pricing-value">${priceCalculation.totalBasePrice.toFixed(2)}</span>
                        </div>

                        {appliedCoupon && (
                            <div className="rooms-details__pricing-item rooms-details__pricing-item--discount">
                                <span className="rooms-details__pricing-label">
                                    {getTranslate("roomDetails", "discount")} ({appliedCoupon.coupon.code}):
                                </span>
                                <span className="rooms-details__pricing-value">-${priceCalculation.discount.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="rooms-details__pricing-divider" />
                        <div className="rooms-details__pricing-item rooms-details__pricing-item--final">
                            <span className="rooms-details__pricing-label">{getTranslate("roomDetails", "totalCost")}:</span>
                            <span className="rooms-details__pricing-value">${priceCalculation.totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                <form className="room__details-form" onSubmit={handleBooking}>
                    <div className="room__details-form-coupon">
                        <div className="room__details-form-coupon-input">
                            <Input
                                brColor="brGold"
                                label={getTranslate("roomDetails", "couponCode")}
                                id="coupon"
                                inputProps={{
                                    name: "coupon_code",
                                    value: couponCode,
                                    onChange: (e) => setCouponCode(e.target.value.toUpperCase()),
                                    disabled: !priceCalculation || appliedCoupon,
                                    placeholder: getTranslate("roomDetails", "enterCouponCode")
                                }}
                                icon={<MdOutlineDiscount />}
                                position="left"
                            />
                        </div>
                        {!appliedCoupon ? (
                            <HoverButton
                               className="room__details-form-coupon__btn"
                                type="button"
                                btnSize="sm"
                                variant="simple"
                                bgColor="rgba(0, 173, 69, 0.9)"
                                hoverBgColor="rgba(31, 132, 71, 1)"
                                textColor="rgba(255, 255, 255, 1)"
                                onClick={handleApplyCoupon}
                                disabled={!couponCode.trim() || !priceCalculation || isValidating}
                            >
                                {isValidating ? getTranslate("roomDetails", "validating") : getTranslate("roomDetails", "apply")}
                            </HoverButton>
                        ) : (
                            <HoverButton
                                type="button"
                                btnSize="sm"
                                variant="simple"
                                bgColor="rgba(220, 53, 69, 0.9)"
                                hoverBgColor="rgba(200, 35, 51, 1)"
                                textColor="rgba(255, 255, 255, 1)"
                                onClick={handleRemoveCoupon}
                            >
                                {getTranslate("roomDetails", "remove")}
                            </HoverButton>
                        )}
                    </div>

                    {couponError && (
                        <div className="room__details-form-error">
                            {couponError}
                        </div>
                    )}

                    {appliedCoupon && (
                        <div className="room__details-form-success">
                            {getTranslate("roomDetails", "couponAppliedSuccess")} ${priceCalculation?.discount.toFixed(2)}
                        </div>
                    )}

                    <div className="room__details-form-action">
                        <HoverButton
                            type="submit"
                            btnSize="full"
                            variant="simple"
                            bgColor="rgba(170, 132, 83, 0.9)"
                            hoverBgColor="rgba(170, 132, 83, 1)"
                            textColor="rgba(255, 255, 255, 1)"
                            disabled={!range.from || !range.to || !priceCalculation}
                        >
                            {getTranslate("roomDetails", "addToCart")}
                        </HoverButton>
                    </div>
                </form>
            </div>
        </article>
    );
};

export default RoomDetailsRight;