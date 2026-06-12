import "./SelectorGuests.css";
import { HoverButton } from "@components/ui";

const SelectorGuests = ({
    toggleGuest,
    controls,
    isGuestsOpen,
    setIsGuestsOpen,
    onDecrease,
    onIncrease
}) => {


    return (
        <div className="hotel-booking__form-content">
            <div className="hotel-booking__form-selector" onClick={toggleGuest} >
                <div className="hotel-booking__form-selector-guests">
                    <label className="hotel-booking__form-selector-label">Guests</label>
                </div>
                <div className="hotel-booking__form-selector-field">
                    <input
                        value={controls.passengersList.map((item) => `${item.count} ${item.label}`).join(', ')}
                        className="hotel-booking__form-input"
                        type="text"
                        readOnly
                    />
                </div>
            </div>


            <div className={`hotel-booking__guests-dropdown ${isGuestsOpen ? "open" : "closed"}`}>
                <div className="hotel-booking__button">
                    <HoverButton className="hotel-booking__button-close" type="button" color="gold" onClick={() => setIsGuestsOpen(false)}>
                        <i className="hotel-booking__form-icon ri-close-line"></i>
                    </HoverButton>
                </div>
                {controls.passengersList.map((item, idx) => (
                    <div className="hotel-booking__guests-container" key={idx}>
                        <div className="hotel-booking__guests-content">
                            <div className="hotel-booking__guests-content-heading">
                                <h1 className="hotel-booking__guests-content-title">{item.label}</h1>
                            </div>
                            <div className="hotel-booking__guests-controls">
                                <button type="button" className="hotel-booking__guests-decrease" onClick={() => onDecrease(item.label)}>
                                    <i className="hotel-booking__guests-icon ri-subtract-line"></i>
                                </button>
                                <span className="hotel-booking__guests-count">{item.count}</span>
                                <button type="button" className="hotel-booking__guests-increase" onClick={() => onIncrease(item.label)}>
                                    <i className="hotel-booking__guests-icon ri-add-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SelectorGuests;