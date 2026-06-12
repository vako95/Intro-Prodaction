import Availability from "../../../components/module/HotelBooking/HotelBooking.jsx";
import FoodCard from "../../../components/module/FoodCard/FoodCard.jsx";
import Overlay from "../../../components/module/Overlay/Overlay.jsx";
import Reservation from "../../../components/module/Reservation/Reservation.jsx";
import Rooms from "../../../components/module/Rooms/Rooms.jsx";
import Services from "../../../components/module/Services/Services.jsx";
import Swap from "../../../components/module/Swap/Swap.jsx";
import Personal from "../../../components/module/Personal/Personal.jsx";
import Testimonial from "../../../components/module/Testimonial/Testimonial.jsx";
import NewsFeed from "../../../components/module/NewsFeed/NewsFeed.jsx";
import AdvantagesBar from "../../../components/module/AdvantagesBar/AdvantagesBar.jsx";
import { Preferences } from "../../../components/ui";
import "./HomePage.css";

const HomePage = () => {
    return (
        <div className="home-page">
            <title>
                Home
            </title>
            <Reservation />
            <Services />
            <Rooms limit={4} />
            <AdvantagesBar />
            <Overlay />
            <Swap />
            <Testimonial />
            <FoodCard />
            <Personal />
            <Availability />
            <NewsFeed />
            <Preferences />
        </div>
    )
}

export default HomePage;
