import { Link } from "react-router-dom";
import clsx from "clsx"
import "./LastNews.css";
import { LoadLine } from "@components/ui";

const LastNews = ({
    title,
    items = [],
    className
}) => {

    const classes = clsx(
        "last-news",
        className
    )
    return (
        <div className={classes}>
            <div className="last-news__heading">
                <h2 className="last-news__heading-title">
                    {title}
                </h2>

                <div className="last-news__load">
                    <LoadLine />
                </div>
            </div>
            <ul className="last-news__list">
                {items.map((item) => (
                    <li className="last-news__item" key={item.id}>
                        <div className="last-news__item-thumb">
                            <img className="last-news__item-thumb-img" src={item.src} alt={item.alt || item.title} />
                        </div>
                        <div className="last-news__content">
                            <Link className="last-news__link" to={item.link}>
                                {item.title}
                            </Link>
                            <time className="last-news__date">
                                {item.date}
                            </time>
                        </div>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default LastNews;