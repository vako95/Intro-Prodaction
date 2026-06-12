import { Container, HoverButton, StripedOverlay } from "@components/ui";
import { FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { roomsAPI } from "@src/api";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "@components/shared";
import { useLang } from "@hooks/useLang";

import "./Pricing.css";

const Pricing = () => {
    const { getTranslate } = useLang();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setLoading(true);
                const data = await roomsAPI.getAll();
                setRooms(data);
            } catch (err) {
                setError(getTranslate("errors", "failedToLoadPricing"));
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleBookNow = (slug) => {
        navigate(`/rooms/${slug}`);
    };

    if (loading) {
        return (
            <Container>
                <div className="pricing">
                    <div className="pricing__loading">{getTranslate("common", "loading")}</div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="pricing">
                    <div className="pricing__error">{error}</div>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="pricing">
                <ul className="pricing__list">
                    {rooms.map((room) => (
                        <li key={room.id} className="pricing__item">
                            <div className="pricing__item-content">
                                <div className="pricing__item-heading">
                                    <span className="pricing__item-heading-price">
                                        ${room.final_price}
                                        <span className="pricing__item-heading-period">
                                            / {getTranslate("cart", "night")}
                                        </span>
                                    </span>
                                    <h1 className="pricing__item-heading-title">
                                        {room.title}
                                    </h1>
                                    {room.subtitle && (
                                        <p className="pricing__item-heading-subtitle">
                                            {room.subtitle}
                                        </p>
                                    )}
                                </div>

                                <ul className="pricing__item-feautures">
                                    {room.amenities && room.amenities.length > 0 ? (
                                        room.amenities.slice(0, 4).map((amenity, index) => (
                                            <li key={index} className="pricing__item-feauture">
                                                <FaCheck className="pricing__item-feauture-icon" />
                                                <span className="pricing__item-feauture-title">
                                                    {amenity}
                                                </span>
                                            </li>
                                        ))
                                    ) : (
                                        <>
                                            <li className="pricing__item-feauture">
                                                <FaCheck className="pricing__item-feauture-icon" />
                                                <span className="pricing__item-feauture-title">
                                                    {room.capacity_adult} {getTranslate("cart", "adults")}
                                                </span>
                                            </li>
                                            {room.capacity_children > 0 && (
                                                <li className="pricing__item-feauture">
                                                    <FaCheck className="pricing__item-feauture-icon" />
                                                    <span className="pricing__item-feauture-title">
                                                        {room.capacity_children} {getTranslate("cart", "children")}
                                                    </span>
                                                </li>
                                            )}
                                            <li className="pricing__item-feauture">
                                                <FaCheck className="pricing__item-feauture-icon" />
                                                <span className="pricing__item-feauture-title">
                                                    {room.size || 30}m² {getTranslate("rooms", "roomSize")}
                                                </span>
                                            </li>
                                            <li className="pricing__item-feauture">
                                                <FaCheck className="pricing__item-feauture-icon" />
                                                <span className="pricing__item-feauture-title">
                                                    {room.view || getTranslate("fallback", "cityView")}
                                                </span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                                <HoverButton
                                    className="btr"
                                    onClick={() => handleBookNow(room.slug)}
                                >
                                    {getTranslate("rooms", "bookNow")}
                                </HoverButton>
                            </div>
                            <div className="pricing__item-media">
                                <div className="pricing__item-media-wrapper">
                                    <StripedOverlay>
                                        <ImageWithFallback
                                            className="pricing__item-media-img"
                                            src={room.poster || room.image}
                                            alt={room.title}
                                        />
                                    </StripedOverlay>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </Container>
    );
};

export default Pricing;