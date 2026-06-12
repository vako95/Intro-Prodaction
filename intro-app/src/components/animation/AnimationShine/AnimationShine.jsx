
import "./AnimationShine.css";
import clsx from "clsx";

const AnimationShine = ({
    children,
    variant,
    className
}) => {

    const classes = clsx(
        "animation-shine",
        className
    )
    return (
        <div className={classes}>
            <div className={clsx("animation-shine__panel", variant && `animation-shine__panel-variant--${variant}`)}>
                {children}
            </div>
        </div>

    )
}

export default AnimationShine;