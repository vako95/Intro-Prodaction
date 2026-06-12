import { useClickOutside } from "@reactuses/core";
import { useRef, useState } from "react";
import { BsCalendar4Event } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import dayjs from "dayjs";
import { useLang } from "@hooks/useLang";

import Calendar from "../../../../ui/Calendar/Calendar";
import Quantity from "../../../../ui/Quantity/Quantity";
import { HoverButton } from "@components/ui";
import "./BookingFields.css";
import { useNavigate } from "react-router-dom";

const BookingFields = () => {
    const { getTranslate } = useLang();
    const navigate = useNavigate();

    const [range, setRange] = useState({
        from: new Date(),
        to: dayjs().add(1, "day").toDate(),
    });

    const [isOpenCalendar, setIsOpenCalendar] = useState(false);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [roomCount, setRoomCount] = useState(1);
    const [adultCount, setAdultCount] = useState(1);
    const [childCount, setChildCount] = useState(0);

    const modalRef = useRef(null);
    const bookingRef = useRef(null);

    useClickOutside(modalRef, () => setIsOpenCalendar(false), ["pointerdown"]);
    useClickOutside(bookingRef, () => setIsBookingOpen(false), ["pointerdown"]);

    const toggleCalendar = () => {
        setIsOpenCalendar((prev) => !prev);
        setIsBookingOpen(false);
    };

    const toggleBooking = () => {
        setIsBookingOpen((prev) => !prev);
        setIsOpenCalendar(false);
    };

    const handleSelectRange = (newRange) => {
        if (!newRange) return;

        const normalizedRange = {
            from: newRange.from
                ? new Date(
                      newRange.from.getFullYear(),
                      newRange.from.getMonth(),
                      newRange.from.getDate()
                  )
                : null,
            to: newRange.to
                ? new Date(
                      newRange.to.getFullYear(),
                      newRange.to.getMonth(),
                      newRange.to.getDate()
                  )
                : null,
        };

        setRange(normalizedRange);
    };

    const handleSearch = (e) => {
        e.preventDefault();

        if (range.from && range.to) {
            const filters = {
                check_in: dayjs(range.from).format("YYYY-MM-DD"),
                check_out: dayjs(range.to).format("YYYY-MM-DD"),
                rooms_count: roomCount,
                adults: adultCount,
                children: childCount,
            };

            navigate("/rooms", { state: { filters } });
        }
    };

    return (
        <div className="reservation__booking-fields">
            <ul className="reservation__booking-fields-list" ref={modalRef}>
                <li className="reservation__booking-fields-item" onClick={toggleCalendar}>
                    <div className="reservation__booking-fields-item-wrapper">
                        <span className="reservation__booking-fields-item-wrapper-icon">
                            <BsCalendar4Event />
                        </span>
                    </div>

                    <div className="reservation__booking-fields-item-content">
                        <h1 className="reservation__booking-fields-item-title">
                            {getTranslate("booking", "checkIn")}
                        </h1>

                        <span className="reservation__booking-fields-item-count">
                            {range.from ? range.from.toLocaleDateString() : ""}
                        </span>

                        <input
                            value=""
                            className="reservation__booking-fields-item-value"
                            type="text"
                            readOnly
                            disabled
                        />
                    </div>

                    {isOpenCalendar && (
                        <div className="reservation__booking-fields-calendar">
                            <Calendar
                                range={range}
                                setRange={handleSelectRange}
                            />
                        </div>
                    )}
                </li>

                <li className="reservation__booking-fields-item" onClick={toggleCalendar}>
                    <div className="reservation__booking-fields-item-wrapper">
                        <span className="reservation__booking-fields-item-wrapper-icon">
                            <BsCalendar4Event />
                        </span>
                    </div>

                    <div className="reservation__booking-fields-item-content">
                        <h1 className="reservation__booking-fields-item-title">
                            {getTranslate("booking", "checkOut")}
                        </h1>

                        <span className="reservation__booking-fields-item-count">
                            {range.to ? range.to.toLocaleDateString() : <HiOutlineDotsHorizontal />}
                        </span>

                        <input
                            value=""
                            className="reservation__booking-fields-item-value"
                            type="text"
                            readOnly
                            disabled
                        />
                    </div>
                </li>

                <li className="reservation__booking-fields-item" onClick={toggleBooking} ref={bookingRef}>
                    <div className="reservation__booking-fields-item-wrapper">
                        <span className="reservation__booking-fields-item-wrapper-icon">
                            <BsCalendar4Event />
                        </span>
                    </div>

                    <div className="reservation__booking-fields-item-content">
                        <h1 className="reservation__booking-fields-item-title">
                            {getTranslate("booking", "guests")}
                        </h1>

                        <div className="reservation__booking-fields-item-control">
                            <span className="reservation__booking-fields-item-control-title">
                                <span className="reservation__booking-fields-item-control-value">
                                    {roomCount}
                                </span>
                                {getTranslate("booking", "room")}
                            </span>

                            <span className="reservation__booking-fields-item-control-title">
                                <span className="reservation__booking-fields-item-control-value">
                                    {adultCount}
                                </span>
                                {getTranslate("booking", "adult")}
                            </span>

                            <span className="reservation__booking-fields-item-control-title">
                                <span className="reservation__booking-fields-item-control-value">
                                    {childCount}
                                </span>
                                {getTranslate("booking", "child")}
                            </span>

                            <input type="hidden" value={roomCount} readOnly disabled />
                            <input type="hidden" value={`${adultCount} Adult`} readOnly disabled />
                            <input type="hidden" value={`${childCount} Child`} readOnly disabled />
                        </div>
                    </div>

                    {isBookingOpen && (
                        <div
                            className="reservation__booking-fields-quantity"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="reservation__booking-fields-quantity-item">
                                <Quantity
                                    title={getTranslate("booking", "room")}
                                    min={1}
                                    max={10}
                                    initial={roomCount}
                                    onChange={setRoomCount}
                                />
                            </div>

                            <div className="reservation__booking-fields-quantity-item">
                                <Quantity
                                    title={getTranslate("booking", "adult")}
                                    min={1}
                                    max={10}
                                    initial={adultCount}
                                    onChange={setAdultCount}
                                />
                            </div>

                            <div className="reservation__booking-fields-quantity-item">
                                <Quantity
                                    title={getTranslate("booking", "child")}
                                    min={0}
                                    max={10}
                                    initial={childCount}
                                    onChange={setChildCount}
                                />
                            </div>
                        </div>
                    )}
                </li>
            </ul>

            <div className="reservation__booking-fields-actions">
                <HoverButton
                    btnSize="full"
                    bgColor="rgba(170, 132, 83, 1)"
                    border={false}
                    onClick={handleSearch}
                    disabled={!range.from || !range.to}
                >
                    <span className="reservation__booking-fields-action-title">
                        {getTranslate("booking", "checkNow")}
                    </span>
                </HoverButton>
            </div>
        </div>
    );
};

export default BookingFields;