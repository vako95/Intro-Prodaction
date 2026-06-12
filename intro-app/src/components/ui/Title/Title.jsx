import clsx from "clsx"
import "./Title.css";

const Title = ({
    as: Tag = "h1",
    children,
    className,
    fontFamily,
    color,
    fontSize,
    ...props
}) => {
    const classes = clsx(
        "title",
        className
    )
    const style = {
        ...(fontFamily && { "--fontFamily": fontFamily }),
        ...(fontSize && { "--fontSize": `${fontSize}px` }),
        ...(color && { "--color": color })
    }
    return (
        <Tag className={classes} style={style} {...props}>
            {children}
        </Tag>
    )
}

export default Title;