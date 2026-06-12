import { Container } from "@components/ui";

import "./Reservation.css";
import BookingFields from "./components/BookingFields/BookingFields.jsx";

const Reservation = () => {

    return (
        <section className="reservation">
            <Container>
                <form className="reservation__form">
                    <BookingFields />
                </form>
            </Container>
        </section>
    );
};

export default Reservation;
