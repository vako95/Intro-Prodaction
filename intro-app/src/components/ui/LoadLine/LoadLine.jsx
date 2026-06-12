import clsx from "clsx";
import "./LoadLine.css";

const LoadLine = ({
    children,
    className
}) => {
    const classes = clsx(
        "load-line",
        className
    )
    return (
        <div className={classes}>
            {children}
        </div>
    )
}

export default LoadLine;