import React from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../../../contexts/WishlistContext";
import { WishlistButton } from "../../ui/WishlistButton";
import { HoverButton } from "../../ui";
import { useLang } from "@hooks/useLang";
import "./SavedRooms.css";

const SavedRooms = () => {
    const { getTranslate } = useLang();
    const { wishlist, loading, error } = useWishlistContext();

    if (loading) {
        return (
            <div className="saved-rooms">
                <div className="saved-rooms__header">
                    <h1 className="saved-rooms__title">{getTranslate("savedRooms", "title")}</h1>
                </div>
                <div className="saved-rooms__loading">{getTranslate("savedRooms", "loading")}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="saved-rooms">
                <div className="saved-rooms__header">
                    <h1 className="saved-rooms__title">{getTranslate("savedRooms", "title")}</h1>
                </div>
                <div className="saved-rooms__error">
                    {getTranslate("savedRooms", "error")}
                </div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="saved-rooms">
                <div className="saved-rooms__header">
                    <h1 className="saved-rooms__title">{getTranslate("savedRooms", "title")}</h1>
                    <p className="saved-rooms__subtitle">
                        {getTranslate("savedRooms", "subtitle")}
                    </p>
                </div>
                <div className="saved-rooms__empty">
                    <div className="saved-rooms__empty-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <h2 className="saved-rooms__empty-title">{getTranslate("savedRooms", "noSavedYet")}</h2>
                    <p className="saved-rooms__empty-text">
                        {getTranslate("savedRooms", "startExploring")}
                    </p>
                    <Link to="/rooms" className="saved-rooms__empty-link">
                        <HoverButton variant="default" border={true}>
                            {getTranslate("savedRooms", "browseRooms")}
                        </HoverButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="saved-rooms">
            <div className="saved-rooms__header">
                <h1 className="saved-rooms__title">{getTranslate("savedRooms", "title")}</h1>
                <p className="saved-rooms__subtitle">
                    {wishlist.length} {wishlist.length === 1 ? getTranslate("savedRooms", "roomSaved") : getTranslate("savedRooms", "roomsSaved")}
                </p>
            </div>
            <div className="saved-rooms__grid">
                {wishlist.map((item) => {
                    const room = item.room;
                    if (!room) return null;

                    return (
                        <div key={item.id} className="saved-rooms__card">
                            <div className="saved-rooms__card-image-wrapper">
                                <Link to={`/rooms/${room.slug}`}>
                                    <img
                                        src={room.poster || room.cover}
                                        alt={room.title}
                                        className="saved-rooms__card-image"
                                    />
                                </Link>
                                <div className="saved-rooms__card-wishlist">
                                    <WishlistButton roomId={room.id} />
                                </div>
                            </div>
                            <div className="saved-rooms__card-content">
                                <Link 
                                    to={`/rooms/${room.slug}`} 
                                    className="saved-rooms__card-title"
                                >
                                    {room.title}
                                </Link>
                                {room.subtitle && (
                                    <p className="saved-rooms__card-subtitle">
                                        {room.subtitle}
                                    </p>
                                )}
                                {room.excerpt && (
                                    <p className="saved-rooms__card-excerpt">
                                        {room.excerpt}
                                    </p>
                                )}
                                <div className="saved-rooms__card-details">
                                    <div className="saved-rooms__card-detail">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" />
                                        </svg>
                                        <span>{room.capacity_total || room.capacity_adult} {getTranslate("savedRooms", "guests")}</span>
                                    </div>
                                    {room.icons && room.icons.length > 0 && (
                                        <div className="saved-rooms__card-detail">
                                            <span>{room.icons.length} {getTranslate("savedRooms", "amenities")}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="saved-rooms__card-footer">
                                    <div className="saved-rooms__card-price">
                                        <span className="saved-rooms__card-price-amount">
                                            ${room.final_price || room.price}
                                        </span>
                                        <span className="saved-rooms__card-price-period">
                                            / {room.time_of_day || "night"}
                                        </span>
                                    </div>
                                    <Link to={`/rooms/${room.slug}`}>
                                        <HoverButton 
                                            variant="default" 
                                            border={true}
                                            btnSize="sm"
                                        >
                                            {getTranslate("savedRooms", "viewDetails")}
                                        </HoverButton>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SavedRooms;
