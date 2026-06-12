import "./FrameLabel.css";
import CalendarDropdown from "../../ui/CalendarDropdown/CalendarDropdown";
const FrameLabel = ({ passengers, setPassengers, toggleLabel, openLabel, renderArrowIcon }) => {

    return (
        <div className="calendar-frame__content">
            <div className="calendar-frame__label">
                <div className="calendar-frame__label-heading">
                    <span
                        className="calendar-frame__label-title"
                        onClick={() => toggleLabel("rooms")}
                    >
                        Rooms
                    </span>
                </div>
                <div className="calendar-frame__label-wrapper"
                    onClick={() => toggleLabel("rooms")}>
                    <input
                        value={`${passengers.rooms.count} ${passengers.rooms.label}`}
                        className="calendar-frame__label-wrapper-input"
                        type="text"
                        readOnly
                    />
                    {renderArrowIcon("rooms")}
                </div>
                <CalendarDropdown
                    wantedLabels={["rooms"]}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    className={openLabel === "rooms" ? "open" : ""}
                />
            </div>
            <div className="calendar-frame__label"
                onClick={() => toggleLabel("guests")}>
                <div className="calendar-frame__label-heading">
                    <span className="calendar-frame__label-title">
                        Guests
                    </span>
                </div>
                <div className="calendar-frame__label-wrapper">
                    <input
                        value="1 Adult, 0 Child"
                        className="calendar-frame__label-wrapper-input"
                        type="text"
                        readOnly
                    />
                    {renderArrowIcon("guests")}
                </div>
                <CalendarDropdown
                    wantedLabels={["adults", "children"]}
                    passengers={passengers}
                    setPassengers={setPassengers}
                    className={openLabel === "guests" ? "open" : ""}
                />
            </div>
        </div>
    )
}

export default FrameLabel;