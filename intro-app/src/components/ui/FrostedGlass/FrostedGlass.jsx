import clsx from "clsx";
import { Container } from "@components/ui"
import "./FrostedGlass.css";

const FrostedGlass = ({ className, children }) => {

    const classes = clsx(
        "frosted-glass",
        className,
    )
    return (

        <div className={classes}>
            {children}
        </div>

    )
}

export default FrostedGlass;