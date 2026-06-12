import clsx from "clsx";
import "./Skeleton.css";

const Skeleton = ({
    as,
    count,
    className,
    ...props
}) => {
    const classes = clsx(
        "skeleton",
        className
    );

    const Component = as;

    return (
        <>
            {Array.from({ length: count }).map((_, idx) => (
                <Component className={classes} key={idx} {...props} />
            ))}
        </>
    )
}

export default Skeleton;