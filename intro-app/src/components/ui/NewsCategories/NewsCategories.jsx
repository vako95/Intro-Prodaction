import clsx from "clsx";
import { CiFolderOn } from "react-icons/ci";
import "./NewsCategories.css";
import { LoadLine } from "@components/ui";
import { Link } from "react-router-dom";

const NewsCategories = ({
    title,
    items = [],
    className
}) => {

    const classes = clsx(
        "news-categories",
        className
    );

    return (
        <div className={classes}>
            <div className="news-categories__heading">
                <h2 className="news-categories__heading-title">
                    {title}
                </h2>
                <LoadLine />
            </div>

            <ul className="news-categories__list">
                {items.map((item) => (
                    <li className="news-categories__item" key={item.id}>
                        <span className="news-categories__item-icon">
                            <CiFolderOn />
                        </span>
                        <Link to={`/news?category=${item.slug || item.id}`} className="news-categories__item-link">
                            {item.title}
                        </Link>
                        {item.count > 0 && (
                            <span className="news-categories__item-count">
                                ({item.count})
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default NewsCategories;
