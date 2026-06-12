import "./BookingForm.css";

import SelectorDate from "./components/SelectorDate/SelectorDate.jsx";
import SelectorRooms from "./components/SelectorRooms/SelectorRooms.jsx";
import SelectorGuests from "./components/SelectorGuests/SelectorGuests.jsx";
import FormSubmit from "./components/FormSubmit/FormSubmit.jsx";


const BookingForm = ({
    toggleCalendar,
    checkIn,
    checkOut,
    rooms,
    setIsRoomsOpen,
    toggleRoom,
    isRoomsOpen,
    onDecreaseRooms,
    onIncreaseRooms,
    toggleGuest,
    setIsGuestsOpen,
    controls,
    isGuestsOpen,
    onDecrease,
    onIncrease,
}) => {

    return (

        <form className="hotel-booking__form-wrapper">
            <SelectorDate
                toggleCalendar={toggleCalendar}
                checkIn={checkIn}
                checkOut={checkOut}
            />
            <SelectorRooms
                toggleRoom={toggleRoom}
                rooms={rooms}
                setIsRoomsOpen={setIsRoomsOpen}
                isRoomsOpen={isRoomsOpen}
                onDecreaseRooms={onDecreaseRooms}
                onIncreaseRooms={onIncreaseRooms}
            />
            <SelectorGuests
                toggleGuest={toggleGuest}
                controls={controls}
                isGuestsOpen={isGuestsOpen}
                setIsGuestsOpen={setIsGuestsOpen}
                onDecrease={onDecrease}
                onIncrease={onIncrease}
            />
            <FormSubmit />
        </form>
    )
}

export default BookingForm;