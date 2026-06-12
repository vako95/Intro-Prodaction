import { Container, BackdropContainer, DecoratedHeading } from "@components/ui";
import { useState } from "react";
import bgBooking from "./assets/img/bg-booking.jpeg";
import bgShape from "./assets/img/bk-shape.png";
import BookingAside from "./components/BookingAside/BookingAside";
import { useLang } from "@hooks/useLang";
import "./HotelBooking.css";

import { HoverButton, BookingFrame, BookingFrameInput, Calendar, Quantity } from "@components/ui";
import { TfiLineDashed } from "react-icons/tfi";
import dayjs from "dayjs";
import { useCalendarControl } from "@hooks";
import { useNavigate } from "react-router-dom";

const HotelBooking = () => {
    const { getTranslate } = useLang();
    const navigate = useNavigate();
    const [range, setRange] = useState({ from: dayjs().toDate(), to: undefined });
    const [rooms, setRooms] = useState(1);
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const { ref, isOpen, toggleDropdown } = useCalendarControl();

    const formatDate = (date) => {
        if (!date) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleSelectRange = (newRange) => {
        if (!newRange) return;
    
        const normalizedRange = {
            from: newRange.from ? new Date(newRange.from.getFullYear(), newRange.from.getMonth(), newRange.from.getDate()) : null,
            to: newRange.to ? new Date(newRange.to.getFullYear(), newRange.to.getMonth(), newRange.to.getDate()) : null
        };
        
        setRange(normalizedRange);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (range.from && range.to) {
            const filters = {
                check_in: dayjs(range.from).format('YYYY-MM-DD'),
                check_out: dayjs(range.to).format('YYYY-MM-DD'),
                rooms_count: rooms,
                adults: adults,
                children: children
            };
            navigate('/rooms', { state: { filters } });
        }
    };

    return (
        <div className="hotel-booking">
            <BackdropContainer backdropHeight="100%" backdrop={bgBooking}>
                <BackdropContainer backdropWidth="50%" backdropHeight="100%" backdrop={bgShape}>
                    <Container>
                        <div className="hotel-booking__container">
                            <article className="hotel-booking__columns hotel-booking__columns--left">
                                <form className="hotel-booking__form" onSubmit={handleSearch}>
                                    <div className="hotel-booking__form-heading">
                                        <DecoratedHeading
                                            className="hotel-booking__form-decorate"
                                            position="start"
                                            showLeftIcon={false}
                                            showRightIcon={false}
                                            title={getTranslate("rooms", "title")}
                                            subtitle={getTranslate("booking", "title")}
                                        />
                                    </div>
                                    <div className="hotel-booking__form-container">
                                        <BookingFrame >
                                            <div className="hotel-booking__form-content" ref={ref} >
                                                <div className="hotel-booking__form-list">
                                                    <div className="hotel-booking__form-item" onClick={() => toggleDropdown("calendar")}>
                                                        <div className="hotel-booking__form-item-heading">
                                                            <h2 className="hotel-booking__form-item-heading-title">
                                                                {getTranslate("booking", "checkIn")}
                                                            </h2>
                                                        </div>
                                                        <div className="hotel-booking__form-item-field">
                                                            <BookingFrameInput
                                                                onChange={handleSelectRange}
                                                                value={range.from ? formatDate(range.from) :
                                                                    <span className="hotel-booking__form-item-field-icon">
                                                                        <TfiLineDashed />
                                                                    </span>
                                                                }
                                                                isOpen={isOpen === "calendar"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="hotel-booking__form-item" onClick={() => toggleDropdown("calendar")}>
                                                        <div className="hotel-booking__form-item-heading">
                                                            <h2 className="hotel-booking__form-item-heading-title">
                                                                {getTranslate("booking", "checkOut")}
                                                            </h2>
                                                        </div>
                                                        <div className="hotel-booking__form-item-field">
                                                            <BookingFrameInput
                                                                onChange={handleSelectRange}
                                                                value={range.to ? formatDate(range.to) :
                                                                    <span className="hotel-booking__form-item-field-icon">
                                                                        <TfiLineDashed />
                                                                    </span>
                                                                }
                                                                isOpen={isOpen === "calendar"}
                                                            />
                                                            {isOpen === "calendar" && (
                                                                <div className="hotel-booking__form-dropdown-calendar">
                                                                    <Calendar months={1} range={range} setRange={handleSelectRange} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="hotel-booking__form-item">
                                                        <div className="hotel-booking__form-item-heading">
                                                            <h2 className="hotel-booking__form-item-heading-title">
                                                                {getTranslate("booking", "rooms")}
                                                            </h2>
                                                        </div>
                                                        <div className="hotel-booking__form-item-field" onClick={() => toggleDropdown("rooms")}>
                                                            <BookingFrameInput
                                                                subtitle={getTranslate("booking", "rooms")}
                                                                value={rooms}
                                                                isOpen={isOpen === "rooms"}
                                                            />
                                                            {isOpen === "rooms" && (
                                                                <div className="hotel-booking__form-field-dropdown-quantity">
                                                                    <Quantity
                                                                        className="hotel-booking__form-field-dropdown-quantity-action"
                                                                        title={getTranslate("booking", "rooms")}
                                                                        initial={rooms}
                                                                        min={1}
                                                                        max={10}
                                                                        onChange={setRooms}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="hotel-booking__form-item">
                                                        <div className="hotel-booking__form-item-heading">
                                                            <h2 className="hotel-booking__form-item-heading-title">
                                                                {getTranslate("booking", "adults")}
                                                            </h2>
                                                        </div>
                                                        <div className="hotel-booking__form-item-field" onClick={() => toggleDropdown("adults")}>
                                                            <BookingFrameInput
                                                                subtitle={getTranslate("booking", "adults")}
                                                                value={adults}
                                                                isOpen={isOpen === "adults"}
                                                            />

                                                            {isOpen === "adults" && (
                                                                <div className="hotel-booking__form-field-dropdown-quantity">
                                                                    <Quantity
                                                                        className="hotel-booking__form-field-dropdown-quantity-action"
                                                                        title={getTranslate("booking", "adults")}
                                                                        variant="small"
                                                                        initial={adults}
                                                                        min={1}
                                                                        max={10}
                                                                        onChange={setAdults}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="hotel-booking__form-item">
                                                        <div className="hotel-booking__form-item-heading">
                                                            <h2 className="hotel-booking__form-item-heading-title">
                                                                {getTranslate("booking", "children")}
                                                            </h2>
                                                        </div>
                                                        <div className="hotel-booking__form-item-field" onClick={() => toggleDropdown("children")}>
                                                            <BookingFrameInput
                                                                subtitle={getTranslate("booking", "children")}
                                                                value={children}
                                                                isOpen={isOpen === "children"}
                                                            />
                                                            {isOpen === "children" && (
                                                                <div className="hotel-booking__form-field-dropdown-quantity">
                                                                    <Quantity
                                                                        title={getTranslate("booking", "children")}
                                                                        className="hotel-booking__form-field-dropdown-quantity-action"
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
                                                <div className="hotel-booking__form-action">
                                                    <HoverButton
                                                        type="submit"
                                                        btnSize="full"
                                                        variant="silver"
                                                        hoverBgOver="rgba(34, 34, 34)"
                                                        disabled={!range.from || !range.to}
                                                    >
                                                        {getTranslate("booking", "bookNow")}
                                                    </HoverButton>
                                                </div>
                                            </div>
                                        </BookingFrame >
                                    </div>
                                </form>
                            </article>
                            <article className="hotel-booking__columns hotel-booking__columns--right">
                                <BookingAside />
                            </article>
                        </div>
                    </Container >
                </BackdropContainer >
            </BackdropContainer >
        </div >
    )
};

export default HotelBooking;
