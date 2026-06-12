import "./SelectorRooms.css";
import { HoverButton } from "@components/ui";

const SelectorRooms = ({
    toggleRoom,
    rooms,
    isRoomsOpen,
    setIsRoomsOpen,
    onDecreaseRooms,
    onIncreaseRooms
}
) => {
    return (
        <div className="hotel-booking__form-content">
            <div className="hotel-booking__form-selector" onClick={toggleRoom}>
                <div className="hotel-booking__form-selector-rooms">
                    <label className="hotel-booking__form-selector-label">{rooms.name}</label>
                </div>
                <div className="hotel-booking__form-selector-field" >
                    <input
                        value={`${rooms.count} Rooms`}
                        className="hotel-booking__form-input"
                        type="text"
                        readOnly
                    />
                </div>
            </div>

            <div className={`hotel-booking__rooms-dropdown ${isRoomsOpen ? "open" : "closed"}`}>
                <div className="hotel-booking__button">
                    <HoverButton className="hotel-booking__button-close" type="button" color="gold" onClick={() => setIsRoomsOpen(false)}>
                        <i className="hotel-booking__form-icon ri-close-line"></i>
                    </HoverButton>
                </div>
                <div className="hotel-booking__rooms-container">
                    <div className="hotel-booking__rooms-content">
                        <div className="hotel-booking__rooms-content-heading">
                            <h1 className="hotel-booking__rooms-content-title">{rooms.name}</h1>
                        </div>
                        <div className="hotel-booking__rooms-controls">
                            <button type="button" className="hotel-booking__rooms-decrease" onClick={onDecreaseRooms}>
                                <i className="hotel-booking__rooms-icon ri-subtract-line"></i>
                            </button>
                            <span className="hotel-booking__rooms-count">{rooms.count}</span>
                            <button type="button" className="hotel-booking__rooms-increase" onClick={onIncreaseRooms}>
                                <i className="hotel-booking__rooms-icon ri-add-line"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectorRooms;