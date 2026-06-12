import clsx from "clsx"
import "./NewsTag.css";
import { LoadLine } from "@components/ui"
import { Link } from "react-router-dom";

const NewsTag = ({
    title,
    items = [],
    className
}) => {

    const classes = clsx(
        "news-tag",
        className
    )

    return (
        <div className={classes}>
            <div className="news-tag__heading">
                <h2 className="news-tag__heading-title">
                    {title}
                </h2>
                <LoadLine />
            </div>

            <ul className="news-tag__list">
                {items.map((item) => (
                    <li key={item.id} className="news-tag__item">
                        <Link to={`/news?tag=${item.slug || item.id}`} className="news-tag__item-link">
                            {item.tag}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default NewsTag;