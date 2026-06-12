import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useClickOutside } from "@reactuses/core";
import { useRooms, useBooking } from "../../../api/index.js";
import Manager from "../../../state/Manager/Manager.jsx";
import Skeleton from "../../../state/Skeleton/Skeleton.jsx";
import { Container } from "@components/ui";
import { HoverButton, BookingFrame, BookingFrameInput, Calendar, Quantity } from "@components/ui";
import { TfiLineDashed } from "react-icons/tfi";
import { useCalendarControl } from "@hooks";
import { useLang } from "@hooks/useLang";
import dayjs from "dayjs";
import "./RoomsFiltered.css";

const RoomsFiltered = () => {
    const { getTranslate } = useLang();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const getFiltersFromURL = useCallback(() => {
        const filters = {};
        if (searchParams.get('check_in')) filters.check_in = searchParams.get('check_in');
        if (searchParams.get('check_out')) filters.check_out = searchParams.get('check_out');
        if (searchParams.get('adults')) filters.adults = parseInt(searchParams.get('adults'));
        if (searchParams.get('children')) filters.children = parseInt(searchParams.get('children'));
        if (searchParams.get('rooms_count')) filters.rooms_count = parseInt(searchParams.get('rooms_count'));
        return filters;
    }, [searchParams]);

    const initialFilters = useMemo(() => 
        location.state?.filters || getFiltersFromURL(), 
        [location.state?.filters, getFiltersFromURL]
    );

    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const roomsQuery = useRooms(appliedFilters);

    const booking = useBooking({
        checkIn: initialFilters.check_in ? dayjs(initialFilters.check_in).toDate() : undefined,
        checkOut: initialFilters.check_out ? dayjs(initialFilters.check_out).toDate() : undefined,
        rooms: initialFilters.rooms_count || 1,
        adults: initialFilters.adults || 1,
        children: initialFilters.children || 0
    });

    const { ref, isOpen, toggleDropdown } = useCalendarControl();
    
    const calendarRef = useRef(null);
    const roomsRef = useRef(null);
    const adultsRef = useRef(null);
    const childrenRef = useRef(null);

    useClickOutside(calendarRef, () => {
        if (isOpen === "calendar") toggleDropdown(null);
    }, ["pointerdown"]);
    
    useClickOutside(roomsRef, () => {
        if (isOpen === "rooms") toggleDropdown(null);
    }, ["pointerdown"]);
    
    useClickOutside(adultsRef, () => {
        if (isOpen === "adults") toggleDropdown(null);
    }, ["pointerdown"]);
    
    useClickOutside(childrenRef, () => {
        if (isOpen === "children") toggleDropdown(null);
    }, ["pointerdown"]);

    const handleRangeChange = useCallback((newRange) => {
        if (newRange) {
            const normalizedRange = {
                from: newRange.from ? new Date(newRange.from.getFullYear(), newRange.from.getMonth(), newRange.from.getDate()) : null,
                to: newRange.to ? new Date(newRange.to.getFullYear(), newRange.to.getMonth(), newRange.to.getDate()) : null
            };
            booking.setRange(normalizedRange);
        } else {
            booking.setRange(newRange);
        }
    }, [booking]);

    useEffect(() => {
        const urlFilters = getFiltersFromURL();
        if (Object.keys(urlFilters).length > 0) {
            setAppliedFilters(urlFilters);
        }
    }, [getFiltersFromURL]);

    const rooms = useMemo(() => 
        Array.isArray(roomsQuery.data?.data) ? roomsQuery.data.data : (Array.isArray(roomsQuery.data) ? roomsQuery.data : []),
        [roomsQuery.data]
    );

    const handleSearch = useCallback((e) => {
        e.preventDefault();
        if (booking.isValid()) {
            const filters = booking.getFilters();
            setAppliedFilters(filters);

            const params = new URLSearchParams();
            if (filters.check_in) params.set('check_in', filters.check_in);
            if (filters.check_out) params.set('check_out', filters.check_out);
            if (filters.adults) params.set('adults', filters.adults);
            if (filters.children) params.set('children', filters.children);
            if (filters.rooms_count) params.set('rooms_count', filters.rooms_count);

            setSearchParams(params);
        }
    }, [booking, setSearchParams]);

    const handleClearFilters = useCallback(() => {
        booking.reset();
        setAppliedFilters({});
        setSearchParams({});
    }, [booking, setSearchParams]);

    const handleBookRoom = useCallback((roomSlug) => {
        const hasAppliedFilters = Object.keys(appliedFilters).length > 0;

        if (hasAppliedFilters) {
            const bookingData = booking.getBookingData();
            navigate(`/rooms/${roomSlug}`, {
                state: {
                    bookingParams: bookingData
                }
            });
        } else {
            navigate(`/rooms/${roomSlug}`);
        }
    }, [appliedFilters, booking, navigate]);

    return (
        <section className="rooms-filtered">
            <Container>
                <div className="rooms-filtered__container">
                    <div className="filter_sticky">
                        <aside className="rooms-filtered__sidebar">
                            <div className="rooms-filtered__filters">
                                <div className="rooms-filtered__filters-header">
                                    <div className="rooms-filtered__filters-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            <circle cx="8" cy="6" r="2" fill="currentColor" />
                                            <circle cx="16" cy="12" r="2" fill="currentColor" />
                                            <circle cx="12" cy="18" r="2" fill="currentColor" />
                                        </svg>
                                    </div>
                                    <h3 className="rooms-filtered__filters-title">{getTranslate("rooms", "filters")}</h3>
                                </div>

                                <form className="rooms-filtered__form" onSubmit={handleSearch}>
                                    <BookingFrame>
                                        <div className="rooms-filtered__form-content" ref={ref}>
                                            <div 
                                                className="rooms-filtered__form-field rooms-filtered__form-field--dates" 
                                                ref={calendarRef}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(isOpen === "calendar" ? null : "calendar");
                                                }}
                                            >
                                                <label>{getTranslate("cart", "dates")}</label>
                                                <div className="rooms-filtered__dates-row">
                                                    <div className="rooms-filtered__date-item">
                                                        <span className="rooms-filtered__date-label">{getTranslate("cart", "checkIn")}</span>
                                                        <BookingFrameInput
                                                            onChange={handleRangeChange}
                                                            value={booking.range.from ? dayjs(booking.range.from).format('DD/MM/YYYY') :
                                                                <span className="rooms-filtered__icon">
                                                                    <TfiLineDashed />
                                                                </span>
                                                            }
                                                            isOpen={isOpen === "calendar"}
                                                        />
                                                    </div>
                                                    <div className="rooms-filtered__date-item">
                                                        <span className="rooms-filtered__date-label">{getTranslate("cart", "checkOut")}</span>
                                                        <BookingFrameInput
                                                            onChange={handleRangeChange}
                                                            value={booking.range.to ? dayjs(booking.range.to).format('DD/MM/YYYY') :
                                                                <span className="rooms-filtered__icon">
                                                                    <TfiLineDashed />
                                                                </span>
                                                            }
                                                            isOpen={isOpen === "calendar"}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {isOpen === "calendar" && (
                                                    <div
                                                        className="rooms-filtered__calendar"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Calendar
                                                            months={1}
                                                            range={booking.range}
                                                            setRange={handleRangeChange}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div 
                                                className="rooms-filtered__form-field" 
                                                ref={roomsRef}
                                                onClick={() => toggleDropdown(isOpen === "rooms" ? null : "rooms")}
                                            >
                                                <label>{getTranslate("cart", "rooms")}</label>
                                                <BookingFrameInput
                                                    value={booking.rooms}
                                                    isOpen={isOpen === "rooms"}
                                                />
                                                {isOpen === "rooms" && (
                                                    <div 
                                                        className="rooms-filtered__dropdown"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Quantity
                                                            title={getTranslate("cart", "rooms")}
                                                            initial={booking.rooms}
                                                            min={1}
                                                            max={10}
                                                            onChange={booking.setRooms}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div 
                                                className="rooms-filtered__form-field" 
                                                ref={adultsRef}
                                                onClick={() => toggleDropdown(isOpen === "adults" ? null : "adults")}
                                            >
                                                <label>{getTranslate("cart", "adults")}</label>
                                                <BookingFrameInput
                                                    value={booking.adults}
                                                    isOpen={isOpen === "adults"}
                                                />
                                                {isOpen === "adults" && (
                                                    <div 
                                                        className="rooms-filtered__dropdown"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Quantity
                                                            title={getTranslate("cart", "adults")}
                                                            initial={booking.adults}
                                                            min={1}
                                                            max={10}
                                                            onChange={booking.setAdults}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div 
                                                className="rooms-filtered__form-field" 
                                                ref={childrenRef}
                                                onClick={() => toggleDropdown(isOpen === "children" ? null : "children")}
                                            >
                                                <label>{getTranslate("cart", "children")}</label>
                                                <BookingFrameInput
                                                    value={booking.children}
                                                    isOpen={isOpen === "children"}
                                                />
                                                {isOpen === "children" && (
                                                    <div 
                                                        className="rooms-filtered__dropdown"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Quantity
                                                            title={getTranslate("cart", "children")}
                                                            initial={booking.children}
                                                            min={0}
                                                            max={10}
                                                            onChange={booking.setChildren}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="rooms-filtered__form-actions">
                                                <HoverButton
                                                    type="submit"
                                                    btnSize="full"
                                                    variant="simple"
                                                    bgColor="rgba(0, 173, 69, 0.9)"
                                                    hoverBgColor="rgba(31, 132, 71, 1)"
                                                    textColor="rgba(255, 255, 255, 1)"
                                                    disabled={!booking.isValid() || roomsQuery.isLoading}
                                                >
                                                    {roomsQuery.isLoading ? getTranslate("rooms", "searching") : getTranslate("rooms", "searchRooms")}
                                                </HoverButton>
                                                <button
                                                    type="button"
                                                    className="rooms-filtered__clear-btn"
                                                    onClick={handleClearFilters}
                                                >
                                                    {getTranslate("rooms", "clearFilters")}
                                                </button>
                                            </div>
                                        </div>
                                    </BookingFrame>
                                </form>

                                {Object.keys(appliedFilters).length > 0 && (
                                    <div className="rooms-filtered__active-filters">
                                        <h4>{getTranslate("rooms", "activeFilters")}</h4>
                                        <div className="filter-tags">
                                            {appliedFilters.check_in && (
                                                <span className="filter-tag">
                                                    {getTranslate("cart", "checkIn")}: {appliedFilters.check_in}
                                                </span>
                                            )}
                                            {appliedFilters.check_out && (
                                                <span className="filter-tag">
                                                    {getTranslate("cart", "checkOut")}: {appliedFilters.check_out}
                                                </span>
                                            )}
                                            {appliedFilters.rooms_count && (
                                                <span className="filter-tag">
                                                    {getTranslate("cart", "rooms")}: {appliedFilters.rooms_count}
                                                </span>
                                            )}
                                            {appliedFilters.adults && (
                                                <span className="filter-tag">
                                                    {getTranslate("cart", "adults")}: {appliedFilters.adults}
                                                </span>
                                            )}
                                            {appliedFilters.children > 0 && (
                                                <span className="filter-tag">
                                                    {getTranslate("cart", "children")}: {appliedFilters.children}
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                )}
                            </div>
                        </aside>
                    </div>


                    <main className="rooms-filtered__content">
                        <div className="rooms-filtered__header">
                            <h2>{getTranslate("rooms", "availableRooms")}</h2>
                            {roomsQuery.data && (
                                <p className="rooms-filtered__count">
                                    {rooms.length} {rooms.length !== 1 ? getTranslate("rooms", "roomsFound") : getTranslate("rooms", "roomFound")}
                                </p>
                            )}
                        </div>

                        <Manager
                            isLoading={roomsQuery.isLoading}
                            isError={roomsQuery.isError}
                            items={rooms}
                            skeletonCustom={
                                <div className="rooms-filtered__skeleton">
                                    {Array.from({ length: 4 }).map((_, idx) => (
                                        <div key={idx} className="room-card-skeleton">
                                            <Skeleton as="div" count={1} className="skeleton-image" />
                                            <Skeleton as="div" count={1} className="skeleton-title" />
                                            <Skeleton as="div" count={2} className="skeleton-text" />
                                            <Skeleton as="div" count={1} className="skeleton-button" />
                                        </div>
                                    ))}
                                </div>
                            }
                            unavailableProps={{
                                title: getTranslate("rooms", "errorLoadingRooms"),
                                message: getTranslate("rooms", "failedToLoadRooms")
                            }}
                            emptyProps={{
                                title: getTranslate("rooms", "noRoomsAvailable"),
                                message: getTranslate("rooms", "noRoomsMatchCriteria")
                            }}
                            renderWrapper="div"
                            skeletonWrapper="div"
                            className="rooms-filtered__grid"
                            renderMap={(room) => (
                                <article key={room.id} className="room-card">
                                    <div className="room-card__image">
                                        <img 
                                            src={room.image || room.cover || room.poster || '/No_image_available.svg.png'} 
                                            alt={room.title || room.name} 
                                            onError={(e) => {
                                                e.target.src = '/No_image_available.svg.png';
                                            }}
                                        />
                                        <span className="room-card__price">
                                            ${room.final_price || room.price || 0}/{getTranslate("rooms", "night")}
                                        </span>
                                    </div>
                                    <div className="room-card__content">
                                        <h3 className="room-card__title">{room.title}</h3>
                                        {room.subtitle && (
                                            <p className="room-card__subtitle">{room.subtitle}</p>
                                        )}
                                        <p className="room-card__description">
                                            {room.excerpt}
                                        </p>

                                        <div className="room-card__details">
                                            <div className="room-card__detail">
                                                <span className="label">{getTranslate("rooms", "capacity")}:</span>
                                                <span className="value">
                                                    {room.capacity_total} {getTranslate("cart", "guests")}
                                                    {room.capacity_adult > 0 && room.capacity_children >= 0 && (
                                                        <span className="capacity-breakdown">
                                                            {' '}({room.capacity_adult} {getTranslate("cart", "adults")}{room.capacity_children > 0 && `, ${room.capacity_children} ${getTranslate("cart", "children")}`})
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            {room.size > 0 && (
                                                <div className="room-card__detail">
                                                    <span className="label">{getTranslate("rooms", "roomSize")}:</span>
                                                    <span className="value">{room.size} m²</span>
                                                </div>
                                            )}
                                            {room.beds > 0 && (
                                                <div className="room-card__detail">
                                                    <span className="label">{getTranslate("rooms", "beds")}:</span>
                                                    <span className="value">{room.beds}</span>
                                                </div>
                                            )}
                                            {room.view && (
                                                <div className="room-card__detail">
                                                    <span className="label">{getTranslate("rooms", "view")}:</span>
                                                    <span className="value">{room.view}</span>
                                                </div>
                                            )}
                                            <div className="room-card__detail">
                                                <span className="label">{getTranslate("rooms", "available")}:</span>
                                                <span className="value">
                                                    {room.room_count} {getTranslate("cart", "rooms")}
                                                </span>
                                            </div>
                                        </div>

                                        {room.amenities && room.amenities.length > 0 && (
                                            <div className="room-card__amenities">
                                                {room.amenities.slice(0, 4).map((amenity, idx) => (
                                                    <span key={idx} className="amenity-tag">{amenity}</span>
                                                ))}
                                                {room.amenities.length > 4 && (
                                                    <span className="amenity-tag">
                                                        +{room.amenities.length - 4} {getTranslate("rooms", "more")}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        <HoverButton
                                            btnSize="full"
                                            variant="simple"
                                            bgColor="rgba(170, 132, 83, 0.9)"
                                            hoverBgColor="rgba(170, 132, 83, 1)"
                                            textColor="rgba(255, 255, 255, 1)"
                                            onClick={() => handleBookRoom(room.slug)}
                                        >
                                            {getTranslate("rooms", "viewDetailsAndBook")}
                                        </HoverButton>
                                    </div>
                                </article>
                            )}
                        />
                    </main>
                </div>
            </Container>
        </section>
    );
};

export default RoomsFiltered;
