import { clsx } from "clsx"
import "./StripedOverlay.css";

const StripedOverlay = ({
    children,
    className
}) => {

    const classes = clsx(
        "striped-overlay",
        className
    )

    return (
        <div className={classes}>
            {children}
        </div>
    )
}

export default StripedOverlay;