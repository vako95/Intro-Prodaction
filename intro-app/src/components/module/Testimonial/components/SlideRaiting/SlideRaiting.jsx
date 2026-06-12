import "./SlideRaiting.css";

const SliderRaiting = ({ rating }) => {
    return (
        <div className="slide-review-stars">
            {[...Array(5)].map((_, idx) => {
                const icon =
                    idx < Math.floor(rating)
                        ? 'ri-star-fill'
                        : idx === Math.floor(rating) && rating % 1 !== 0
                            ? 'ri-star-half-line'
                            : 'ri-star-line';
                return <i key={idx} className={`slide-review-star ${icon}`}></i>;
            })}
        </div>
    );
};

export default SliderRaiting;