import "./FrameDates.css";
import { Calendar } from "@components/ui";
import { useLang } from "@hooks/useLang";

const FrameDates = ({
    setOpenLabel,
    checkIn,
    checkOut,
    toggleLabel,
    openLabel,
    renderArrowIcon,
    handleCheckIn,
    handleCheckOut
}) => {
    const { getTranslate } = useLang();
    const labels = [
        getTranslate("booking", "checkIn"),
        getTranslate("booking", "checkOut")
    ];

    return (
        <div className="calendar-frame__dates" onClick={() => toggleLabel("calendar")}>
            {labels.map((label, idx) => (
                <div className="calendar-frame__label" key={label}>
                    <div className="calendar-frame__label-heading">
                        <span className="calendar-frame__label-title">{label}</span>
                    </div>
                    <div className="calendar-frame__label-wrapper">
                        <input
                            value={idx === 0 ? checkIn.format("DD.MM.YYYY") : checkOut.format("DD.MM.YYYY")}
                            className="calendar-frame__label-wrapper-input"
                            type="text"
                            readOnly
                        />
                        {renderArrowIcon("calendar")}
                    </div>
                </div>
            ))}
            {openLabel === "calendar" && (
                <Calendar
                    variant="fullScreen"
                    closeButton={true}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onCheckInChange={handleCheckIn}
                    onCheckOutChange={handleCheckOut}
                    onClose={() => setOpenLabel(false)}
                />
            )}
        </div>
    )
}

export default FrameDates;