import "./Calendar.css";
import dayjs from "dayjs";
import { useLang } from "@hooks/useLang";
import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

import CustomMonthsDropdown from "./components/CustomMonthsDropdown/CustomMonthsDropdown.jsx";
import CustomYearsDropdown from "./components/CustomYearsDropdown/CustomYearsDropdown.jsx";

const Calendar = ({ range, setRange, months = 2 }) => {
    const { getTranslate } = useLang();
    const [isMobile, setIsMobile] = useState(
        typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1024px)");
        
        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    const footer = range?.from ? (
        range.to ? (
            <p className="calendar__footer">
                Entery:{" "}
                <span className="calendar__footer-date">
                    {range.from.toLocaleDateString()}
                </span>{" "}
                &nbsp;
                Leave:{" "}
                <span className="calendar__footer-date">
                    {range.to.toLocaleDateString()}
                </span>
            </p>
        ) : (
            <p className="calendar__footer">
                You chose start date:{" "}
                <span className="calendar__footer-date">
                    {range.from.toLocaleDateString()}
                </span>
            </p>
        )
    ) : (
        <p className="calendar__footer calendar__footer--empty">
            {getTranslate("calendar", "pleaseChooseFullDate")}
        </p>
    );

    return (
        <div className="calendar" onClick={(e) => e.stopPropagation()}>
            <div className="calendar__content">
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    numberOfMonths={isMobile ? 1 : months}
                    animate
                    navLayout="around"
                    captionLayout="dropdown"
                    startMonth={dayjs().toDate()}
                    endMonth={dayjs().add(2, "year").toDate()}
                    defaultMonth={new Date()}
                    today={new Date()}
                    disabled={{ before: new Date() }}
                    components={{
                        MonthsDropdown: CustomMonthsDropdown,
                        YearsDropdown: CustomYearsDropdown,
                    }}
                    classNames={{
                        disabled: "my-disabled_style",
                    }}
                />
            </div>

            {footer}
        </div>
    );
};

export default Calendar;