import "./SelectorDate.css";

const SelectorDate = ({
    toggleCalendar,
    checkIn,
    checkOut,
}) => {

    return (
        <div className="hotel-booking__form-control" onClick={toggleCalendar}>
            <div className="hotel-booking__form-content">
                <div className="hotel-booking__form-selector">
                    <div className="hotel-booking__form-selector-date">
                        <label className="hotel-booking__form-selector-label">Check In</label>
                    </div>
                    <div className="hotel-booking__form-selector-field">
                        <input
                            value={checkIn?.format("DD.MM.YYYY") || "-"}
                            className="hotel-booking__form-input"
                            type="text"
                            readOnly
                        />
                    </div>
                </div>
            </div>

            <div className="hotel-booking__form-content">
                <div className="hotel-booking__form-selector">
                    <div className="hotel-booking__form-selector-date">
                        <label className="hotel-booking__form-selector-label">Check Out</label>
                    </div>
                    <div className="hotel-booking__form-selector-field">
                        <input
                            value={checkOut?.format("DD.MM.YYYY") || "-"}
                            className="hotel-booking__form-input"
                            type="text"
                            readOnly
                        />
                    </div>
                </div>
            </div>

        </div>

    )
}

export default SelectorDate