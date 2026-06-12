import { useState } from "react";
import dayjs from "dayjs";

export const useBooking = (initialValues = {}) => {
    const [range, setRange] = useState({
        from: initialValues.checkIn || dayjs().toDate(),
        to: initialValues.checkOut || dayjs().add(1, "day").toDate()
    });
    
    const [rooms, setRooms] = useState(initialValues.rooms || 1);
    const [adults, setAdults] = useState(initialValues.adults || 1);
    const [children, setChildren] = useState(initialValues.children || 0);

    const handleSelectRange = (newRange) => {
        if (!newRange) return;
        setRange(newRange);
    };

    const getBookingData = () => ({
        check_in: range.from ? dayjs(range.from).format('YYYY-MM-DD') : null,
        check_out: range.to ? dayjs(range.to).format('YYYY-MM-DD') : null,
        rooms_count: rooms,
        adults: adults,
        children: children
    });

    const getFilters = () => {
        const data = getBookingData();
        if (!data.check_in || !data.check_out) return {};
        return data;
    };

    const isValid = () => {
        return range.from && range.to && rooms > 0 && adults > 0;
    };

    const reset = () => {
        setRange({
            from: dayjs().toDate(),
            to: dayjs().add(1, "day").toDate()
        });
        setRooms(1);
        setAdults(1);
        setChildren(0);
    };

    return {
        range,
        setRange: handleSelectRange,
        rooms,
        setRooms,
        adults,
        setAdults,
        children,
        setChildren,
        getBookingData,
        getFilters,
        isValid,
        reset
    };
};
