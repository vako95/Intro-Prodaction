import React from "react";
import { Link } from "react-router-dom";
import { useWishlistContext } from "../../../../../contexts/WishlistContext";
import { useLang } from "@hooks/useLang";
import "./WishlistIcon.css";

const WishlistIcon = ({ showText = false }) => {
    const { count, isAuthenticated } = useWishlistContext();
    const { getTranslate } = useLang();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Link to="/saved-rooms" className="wishlist-icon">
            <div className={`wishlist-icon__wrapper ${showText ? 'wishlist-icon__wrapper--with-text' : ''}`}>
                <svg
                    className="wishlist-icon__svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {showText ? (
                    <span className="wishlist-icon__text">
                        {getTranslate("common", "wishlist")} ({count})
                    </span>
                ) : (
                    count > 0 && (
                        <span className="wishlist-icon__badge">
                            {count > 99 ? '99+' : count}
                        </span>
                    )
                )}
            </div>
        </Link>
    );
};

export default WishlistIcon;
