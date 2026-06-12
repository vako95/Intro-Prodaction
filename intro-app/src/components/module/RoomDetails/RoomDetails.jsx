import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./RoomDetails.css";

import { Container } from "@components/ui";
import RoomDetailsColumns from "./components/RoomDetailsColumns/RoomDetailsColumns.jsx";
import RoomDetailsGallery from "./components/RoomDetailsGallery/RoomDetailsGallery.jsx";
import RoomDetailsSlider from './components/RoomDetailsSlider/RoomDetailsSlider.jsx';

const RoomDetails = () => {
    const { slug } = useParams();
    const sectionRef = useRef(null);

    useEffect(() => {
        if (sectionRef.current) {
            const yOffset = -100;
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [slug]);

    return (
        <div className="room-details-wrapper">
            <Container>
                <section ref={sectionRef} className="room-details">
                    <RoomDetailsColumns />
                    <RoomDetailsGallery />
                    <RoomDetailsSlider />
                </section>
            </Container>
        </div>
    )
}

export default RoomDetails;