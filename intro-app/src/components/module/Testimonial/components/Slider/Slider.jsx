import "./Slider.css";

const Slider = ({ slide }) => {
    return (
        <div className="slide-content">
            <div className="slide-content-wrapper">
                <img
                    src={slide.img}
                    alt="Reviewer"
                    className="slide-content-cover"
                />
            </div>
        </div>
    )
}

export default Slider;