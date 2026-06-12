import "./CalendarDropdown.css";
import React from "react";
import { Container } from "@components/ui";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";
import clsx from "clsx";

const CalendarDropdown = ({ wantedLabels = [], className, setPassengers, passengers }) => {
    const classes = clsx("calendar__frame-dropdown", className);

    const filteredPassengers = wantedLabels
        .filter(label => passengers[label])
        .map(label => passengers[label]);


    const onIncrease = (label) => {
        setPassengers(prev => ({
            ...prev,
            [label]: {
                ...prev[label],
                count: Math.min(prev[label].count + 1, prev[label].max)
            }
        }));
    };

    const onDecrease = (label) => {
        setPassengers(prev => ({
            ...prev,
            [label]: {
                ...prev[label],
                count: Math.max(prev[label].count - 1, prev[label].min)
            }
        }));
    };
    return (
        <Container>
            <div className={classes} onClick={(e) => e.stopPropagation()}>
                {filteredPassengers.map((item) => (
                    <div key={item.label} className="calendar__frame-dropdown__wrapper">
                        <div className="calendar__frame-dropdown-item">
                            <div className="calendar-frame-dropdown__heading">
                                <span className="calendar-frame-dropdown__title">
                                    {item.label}
                                </span>
                            </div>

                            <div className="calendar-frame-dropdown__controls">
                                <button
                                    className="calendar-frame-dropdown__button"
                                    onClick={() => onDecrease(item.label)}
                                >
                                    <CiCircleMinus className="calendar-frame-dropdown-icon" />
                                </button>
                                <span className="calendar-frame-dropdown__value">
                                    {item.count}
                                </span>

                                <button
                                    className="calendar-frame-dropdown__button"
                                    onClick={() => onIncrease(item.label)}
                                >
                                    <CiCirclePlus className="calendar-frame-dropdown-icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Container>
    );
};

export default React.memo(CalendarDropdown);
