import "./BackdropContainer.css";
import clsx from "clsx";

const BackdropContainer = ({
    className,
    children,
    backdrop,
    alt,
    backdropHeight,
    backdropWidth,
    attachment = "scroll",
    repeat = false,
    backdropFilter = false,
    position = "bottom",
    fullScreen = false,
    animation = false
}) => {
    const classes = clsx(
        "backdrop-container",
        fullScreen && "backdrop-image-size--full-screen",
        animation && "backdrop-image-animation-float",
        className
    );


    const backdropStyle = {
        height: backdropHeight,
        width: backdropWidth,
        backgroundImage: `url(${backdrop})`,
        backgroundAttachment: attachment,
    };

    return (
        <div className={classes}>
            {backdropFilter && <div className="backdrop-overlay" />}
            <div
                className={clsx(
                    "backdrop-image",
                    position === "top" && "backdrop-image-position--top",
                    attachment === "fixed" && `backdrop-image--attachment${attachment}`,
                    repeat && "backdrop-image-repeat"
                )}
                style={backdropStyle}
                aria-label={alt}
            />
            {children && <div className="backdrop-content">{children}</div>}
        </div>
    );


};

export default BackdropContainer;
