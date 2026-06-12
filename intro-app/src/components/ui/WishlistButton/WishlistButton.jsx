import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useWishlistContext } from "../../../contexts/WishlistContext";
import { useLang } from "@hooks/useLang";
import "./WishlistButton.css";

/**
 * Кнопка добавления/удаления из wishlist
 * @param {Object} props
 * @param {number} props.roomId - ID комнаты
 * @param {string} props.className - Дополнительный CSS класс
 * @param {boolean} props.showTooltip - Показывать tooltip
 * @param {Function} props.onToggle - Callback после toggle
 */
export const WishlistButton = memo(({ 
    roomId, 
    className = "", 
    showTooltip = true,
    onToggle 
}) => {
    const { isWishlisted, toggleWishlist, isAuthenticated } = useWishlistContext();
    const { getTranslate } = useLang();
    const [isAnimating, setIsAnimating] = useState(false);
    const [localWishlisted, setLocalWishlisted] = useState(false);

    useEffect(() => {
        setLocalWishlisted(isWishlisted(roomId));
    }, [isWishlisted, roomId]);

    const handleClick = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            window.location.href = "/auth/login";
            return;
        }

        setIsAnimating(true);
        setLocalWishlisted(!localWishlisted);

        const result = await toggleWishlist(roomId);

        if (!result.success) {
            setLocalWishlisted(localWishlisted);
        }

        requestAnimationFrame(() => {
            setTimeout(() => setIsAnimating(false), 600);
        });

        if (onToggle) {
            onToggle(result.is_wishlisted);
        }
    }, [isAuthenticated, localWishlisted, toggleWishlist, roomId, onToggle]);

    const tooltipText = useMemo(() => 
        localWishlisted 
            ? getTranslate("wishlist", "removeFromFavorites") 
            : getTranslate("wishlist", "saveForLater"),
        [localWishlisted, getTranslate]
    );

    const buttonClassName = useMemo(() => 
        `wishlist-button ${localWishlisted ? "wishlisted" : ""} ${isAnimating ? "animating" : ""} ${className}`,
        [localWishlisted, isAnimating, className]
    );

    return (
        <button
            className={buttonClassName}
            onClick={handleClick}
            aria-label={tooltipText}
            title={showTooltip ? tooltipText : ""}
        >
            <svg
                className="wishlist-icon"
                viewBox="0 0 24 24"
                fill={localWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </button>
    );
});

WishlistButton.displayName = "WishlistButton";
