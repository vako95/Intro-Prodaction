import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HoverButton } from "@components/ui";
import { WishlistButton } from "@components/ui/WishlistButton";
import { ICON_MAP } from "@constants/map.js";
import { useLang } from "@hooks/useLang";
import "./RoomsItem.css";

const RoomsItem = ({ item, viewMode = 'grid' }) => {
    const { id, slug, cover, title, price, time_of_day, icons = [] } = item;
    const { getTranslate } = useLang();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleImageLoad = () => {
        setIsImageLoaded(true);
    };

    const handleImageError = () => {
        setIsImageLoaded(true);
    };

    const handleBookNow = () => {
       
        const hasFilters = location.state?.filters && Object.keys(location.state.filters).length > 0;
        
        if (hasFilters) {
            navigate(`/rooms/${slug}`, { state: { bookingParams: location.state.filters } });
        } else {
            navigate(`/rooms/${slug}`);
        }
    };

    const getLinkState = () => {
        const hasFilters = location.state?.filters && Object.keys(location.state.filters).length > 0;
        return hasFilters ? { bookingParams: location.state.filters } : undefined;
    };

    return (
        <div className={`rooms__item rooms__item--${viewMode}`}>
            {!isImageLoaded && <div className="rooms__item-skeleton" />}
            <img
                src={cover}
                alt={title}
                className="rooms__item-image"
                onLoad={handleImageLoad}
                onError={handleImageError}
            />
            <div className="rooms__item-wishlist">
                <WishlistButton roomId={id} />
            </div>
            <div className="rooms__item-wrapper">
                <div className="rooms__content">
                    <Link className="rooms__content-link" to={`/rooms/${slug}`} state={getLinkState()}>
                        {title}
                    </Link>
                    <span className="rooms__content-price">
                        ${price} / {time_of_day}
                    </span>
                </div>
                <div className="rooms__service">
                    <div className="rooms__service-action">
                        <HoverButton
                            btnSize="sm"
                            variant="simple"
                            bgColor="rgba(170, 132, 83, 0.9)"
                            hoverBgColor="rgba(170, 132, 83, 1)"
                            textColor="rgba(255, 255, 255, 1)"
                            onClick={handleBookNow}
                        >
                            <span className="rooms__service-action-title">
                                {getTranslate("rooms", "bookNow")}
                            </span>
                        </HoverButton>
                    </div>
                    <ul className="rooms__service-list">
                        {icons.map((icon, idx) => {
                            const iconKey = typeof icon === 'object' ? icon.key : icon;
                            const Icon = ICON_MAP[iconKey] ?? ICON_MAP["default"];
                            return (
                                <li key={icon?.id || idx} className="rooms__service-item">
                                    <span className="rooms__service-item-icon">
                                        <Icon />
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RoomsItem;
