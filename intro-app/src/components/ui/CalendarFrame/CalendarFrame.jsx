import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import { Container, HoverLink, Calendar } from "@components/ui";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import clsx from "clsx"

import "./CalendarFrame.css";
import FrameHeading from "./components/FrameHeading/FrameHeading";
import FrameDates from "./components/FrameDates/FrameDates";
import FrameLabel from "./components/FrameLabel/FrameLabel";

const CalendarFrame = (
    {
        title = "",
        subtitle = "",
        className,
        padding,
        noContainer = false,
        ...props
    }
) => {
    const [openLabel, setOpenLabel] = useState(false);
    const [checkIn, setCheckIn] = useState(dayjs());
    const [checkOut, setCheckOut] = useState(dayjs().add(1, "day"));
    const [passengers, setPassengers] = useState({
        rooms: { label: "rooms", count: 1, min: 0, max: 10 },
        adults: { label: "adults", count: 1, min: 1, max: 10 },
        children: { label: "children", count: 0, min: 0, max: 10 }
    });

    const classes = clsx(
        "calendar-frame",
        className
    )
    const styles = {
        ...(padding !== false && { padding: padding || "144px" })
    }
    const handleCheckIn = (date) => {
        const isSameDay = date.isSame(checkIn);
        setCheckIn(date);
        setCheckOut(date.add(1, "day"));
        setOpenLabel(isSameDay ? false : "calendar");
    };

    const handleCheckOut = (date) => {
        setCheckOut(date);
        setOpenLabel(false);
    };

    const toggleLabel = (label) => {
        setOpenLabel(prev => (prev === label ? false : label));
    };

    const renderArrowIcon = (label) =>
        openLabel === label ? (
            <IoIosArrowUp className="calendar-frame__label-wrapper-icon" />
        ) : (
            <IoIosArrowDown className="calendar-frame__label-wrapper-icon" />
        );

    const content = (
        <section className={classes} style={styles} {...props}>
            <div className="calendar-frame__wrapper">
                <FrameHeading
                    title={title}
                    subtitle={subtitle}
                />
                <FrameDates
                    handleCheckIn={handleCheckIn}
                    handleCheckOut={handleCheckOut}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    openLabel={openLabel}
                    toggleLabel={toggleLabel}
                    renderArrowIcon={renderArrowIcon}
                    setOpenLabel={setOpenLabel}
                />
                <FrameLabel
                    passengers={passengers}
                    setPassengers={setPassengers}
                    toggleLabel={toggleLabel}
                    openLabel={openLabel}
                    renderArrowIcon={renderArrowIcon}
                />
                <HoverLink
                    hoverBgColor="rgba(33, 33, 33)"
                    bgColor="rgba(170, 132, 83)"
                    to="#" className="calendar-frame__submit">
                    Check Availability
                </HoverLink>
            </div>
        </section>
    );

    return noContainer ? content : <Container>{content}</Container>;
};

export default React.memo(CalendarFrame);
