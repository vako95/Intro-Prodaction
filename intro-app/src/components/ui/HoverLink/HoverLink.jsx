import "./HoverLink.css";
import clsx from "clsx";
import { Link } from "react-router-dom";

const HoverLink = ({
    className,
    children,
    size,
    fontSize,
    color,
    hoverColor,
    hoverBgColor,
    hoverTextColor,
    textColor,
    variant,
    border,
    borderColor,
    animeColor,
    bgColor,
    ...props
}) => {
    const classes = clsx(
        "hover__link",
        size && `hover__link-size--${size}`,
        border && "hover__link--border",
        variant && `hover__link-variant--${variant}`,
        className
    );

    const styless = {
        ...(color && { "--link-color": color }),
        ...(hoverColor && { "--hover__link-color": hoverColor }),
        ...(fontSize && { "--hover__link-fontSize": fontSize }),
        ...(borderColor && { "--hover__link-border-color": borderColor }),
        ...(bgColor && { "--hover-bg-color": bgColor }),
        ...(animeColor && { "--hover__link-anime": animeColor }),
    }


    return (
        <Link className={classes} style={styless} {...props}>
            {children}
        </Link>
    );
};

export default HoverLink;
