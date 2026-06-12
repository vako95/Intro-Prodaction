import "./BookingOrder.css";
import { LuBadgeInfo } from "react-icons/lu";

import Input from "../Input/Input";

import { MdOutlineDiscount } from "react-icons/md";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useLang } from "@hooks/useLang";



const BookingOrder = ({ value, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { getTranslate } = useLang();

    const classes = clsx(
        "booking-order",
        className
    )
    const toggleBaseList = () => {
        setIsOpen((prev) => !prev);
    }

    return (
        <div className={classes}>
            <div className="booking-order__container">
                <div className="booking-order__heading">
                    <h2 className="booking-order__heading-title">
                        {getTranslate("roomDetails", "totalCost")}
                    </h2>
                    <span className="booking-order__heading-price">
                        450${value}
                    </span>
                </div>
                <div className="booking-order__base">
                    <div className={clsx(
                        "booking-order__base-heading",
                        isOpen && "booking-order__base-heading--open"
                    )} onClick={toggleBaseList}>
                        <h2 className="booking-order__base-heading-title">
                            {getTranslate("roomDetails", "totalBasePrice")}
                        </h2>
                        <span className="booking-order__base-heading-icon" >
                            <LuBadgeInfo />
                        </span>

                        <AnimatePresence initial={false}>
                            {isOpen && (
                                <motion.div
                                    className="booking-order__base-tooltip"
                                    initial={{ opacity: 0, scale: 0.95, x: "10%" }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0, x: "0%" }}
                                    transition={{ type: "tween", duration: 0.3 }}
                                >
                                    <div className="booking-order__base-tooltip-heading">
                                        <h3 className="booking-order__base-tooltip-heading-title">
                                            {getTranslate("roomDetails", "basePriceBreakdown")}
                                        </h3>
                                        <span className="booking-order__base-tooltip-subtitle">
                                            <span className="booking-order__base-tooltip-count">
                                                1
                                            </span>
                                            {getTranslate("roomDetails", "night")}
                                        </span>
                                    </div>

                                    <div className="booking-order__base-tooltip-details">
                                        <span className="booking-order__base-tooltip-details-date">2025-11-10</span>
                                        <span className="booking-order__base-tooltip-details-price">$90</span>
                                    </div>

                                    <div className="booking-order__base-tooltip-footer">
                                        <span className="booking-order__base-tooltip-title">{getTranslate("roomDetails", "totalBasePrice")}</span>
                                        <span className="booking-order__base-tooltip-price">$90</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <span className="booking-order__base-price">
                        450${value}
                    </span>

                </div>
                <div className="booking-order__coupon">
                    <div className="booking-order__coupon-input-wrapper">
                        <Input
                            brColor="brGold"
                            label={getTranslate("roomDetails", "couponCode")}
                            id="coupon"
                            inputProps={{
                                name: "promo_code",
                            }}
                            icon={<MdOutlineDiscount />}
                            position="left"
                            placeholder={getTranslate("booking", "promo")}
                        />
                    </div>
                </div>
                <div className="booking-order__total">
                    <div className="booking-order__total-title">
                        {getTranslate("roomDetails", "totalCost")}
                    </div>
                    <span className="booking-order__total-price">
                        450${value}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BookingOrder;