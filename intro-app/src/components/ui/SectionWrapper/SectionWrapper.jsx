import { memo } from "react";
import clsx from "clsx";

import "./SectionWrapper.css";

const SectionWrapper = ({ className, children, bgColor }) => {

    const classes = clsx(
        "section-wrapper",
        bgColor && `section-wrapper--bg-${bgColor}`,
        className
    )

    return (
        <section className={classes}>
            {children}
        </section>
    )
}

export default memo(SectionWrapper);