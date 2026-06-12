import { memo, useMemo, useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import clsx from "clsx";
import "./HotelRating.css";

const HotelRating = ({
    value = 2.4,
    max = 5,
    onChange,
    size = 16,
    color = "white",
    className
}) => {
    const [selectedRating, setSelectedRating] = useState(value);
    const [hoveredRating, setHoveredRating] = useState(null);

    const classes = clsx(
        "hotel-rating",
        className
    )

    const styles = {
        ...(size && { '--rating-size': `${size}px` }),
        "--star-full": `var(--star-full-${color})`,
        "--star-half": `var(--star-half-${color})`,
        "--star-empty": `var(--star-empty-${color})`,
    }

    const handleHover = (value) => {
        setHoveredRating(value);
    }

    const handleSelect = (value) => {
        setSelectedRating(value);
        onChange?.(value);
    }

    const renderedStars = useMemo(() => {
        const stars = [];
        const fullStars = Math.round((hoveredRating ?? selectedRating).toFixed(2));
        let halfStar = (selectedRating - fullStars) > 0
        Array.from({ length: max }).map((_, idx) => {
            const starIndex = idx + 1
            if (starIndex <= fullStars) {
                stars.push(
                    <span
                        key={idx}
                        className="hotel-rating__icon  hotel-rating__icon--full"
                        onMouseEnter={() => handleHover(starIndex)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleSelect(starIndex)}
                    >
                        <FaStar />
                    </span>
                )
            }
            else if (halfStar && hoveredRating == null) {
                stars.push(
                    <span
                        key={idx}
                        className="hotel-rating__icon hotel-rating__icon--half"
                        onMouseEnter={() => handleHover(starIndex)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleSelect(starIndex)}
                    >
                        <FaStarHalfAlt />
                    </span>
                )
                halfStar = false;
            }
            else {
                stars.push(
                    <span
                        key={idx}
                        className="hotel-rating__icon hotel-rating__icon--empty"
                        onMouseEnter={() => handleHover(starIndex)}
                        onMouseLeave={() => setHoveredRating(null)}
                        onClick={() => handleSelect(starIndex)}
                    >
                        <FaRegStar />
                    </span>
                )
            }
        })

        return stars;
    }, [handleHover, handleSelect, hoveredRating, selectedRating]);


    return <div className={classes} style={styles}>{renderedStars}</div>
}

export default memo(HotelRating);