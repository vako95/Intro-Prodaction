import clsx from "clsx";
import { IoChevronDown } from "react-icons/io5";
import "./BookingFrameInput.css";

const BookingFrameInput = ({
    title,
    subtitle,
    value,
    time,
    isOpen,
    position,
    ...props
}) => {

    return (
        <div className="frame-input" {...props}>
            <input
                className="frame-input__field"
                value={value || ""}
                type="text"
                disabled
                hidden
            />

            <div className="frame-input__content">
                {title && <h4 className="frame-input__title">{title}</h4>}

                <div className={clsx("frame-input__info" && `frame-input__info-position--${position}`)}>
                    <span className="frame-input__value">{value}</span>
                    {subtitle && <span className="frame-input__subtitle">{subtitle}</span>}

                    {/* {time && (
                        <time className="frame-input__time" dateTime={time}>
                            {time}
                        </time>
                    )} */}
                </div>
            </div>

            <div className="frame-input__badge">
                <span
                    className={clsx("frame-input__badge-icon", {
                        "frame-input__badge-icon--open": isOpen,
                    })}
                >
                    <IoChevronDown />
                </span>
            </div>
        </div>
    );
};

export default BookingFrameInput;
