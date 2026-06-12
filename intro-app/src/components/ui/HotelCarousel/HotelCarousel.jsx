
import { Link } from "react-router-dom"
import clsx from "clsx";
import { slicetext } from "@/utils/slicetext.js"
import "./HotelCarousel.css";
const HotelCarousel = ({ src, alt, badge, title, desc, className, roomSlug, ...props }) => {

    const classes = clsx(
        "hotel-carousel",
        className
    )
    
    const linkTo = roomSlug ? `/rooms/${roomSlug}` : "#";
    
    return (
        <Link to={linkTo} className={classes} {...props} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="hotel-carousel-wrapper">
                <img className="hotel-carousel__wrapper-img" src={src} alt={alt} />
                <div className="hotel-carousel-preview">
                    <h2 className="hotel-carousel-preview-badge" data-tooltip-id="my-tooltip" data-tooltip-content={badge}>
                        {slicetext(badge, 16)}
                    </h2>
                </div>
            </div>

            <div className="hotel-carousel__caption">
                <ul className="hotel-carousel__caption-list">
                    <li className="hotel-carousel__caption-item">
                        <span className="hotel-carousel__caption-item-link" data-tooltip-id="my-tooltip" data-tooltip-content={title}>
                            {slicetext(title, 16)}
                        </span>
                        <p className="hotel-carousel__caption-item-desc" data-tooltip-id="my-tooltip" data-tooltip-content={desc}>
                            {slicetext(desc, 36)}
                        </p>
                    </li>
                </ul>
            </div>
        </Link>
    )
}

export default HotelCarousel;