import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { CiFolderOn } from "react-icons/ci";
import { FaArrowAltCircleRight } from "react-icons/fa";
import dayjs from "dayjs";
import { useLang } from "@hooks/useLang";
import "./NewsItemMeta.css";
import { HoverLink } from "@components/ui";

const NewsItemMeta = ({ item }) => {
    const { getTranslate } = useLang();
    const date = dayjs(item?.date);
    const author = typeof item?.author === 'object' 
        ? (item.author.first_name || item.author.username || 'Admin')
        : (item?.author || 'Admin');
    const category = typeof item?.category === 'object'
        ? (item.category.title || item.category.name || 'News')
        : (item?.category || 'News');
    
    return (
        <div className="news__item-meta">
            <time className="news__item-meta-calendar" dateTime={date.format('YYYY-MM-DD')}>
                <span className="news__item-meta-calendar-month">
                    {date.format('MMM')}
                </span>
                <span className="news__item-meta-calendar-date">
                    {date.format('DD')}
                </span>
            </time>
            <div className="news__item-meta-container">
                <div className="news__item-meta-content">
                    <ul className="news__item-meta-list">
                        <li className="news__item-meta-item">
                            <div className="news__item-meta-item-person">
                                <span className="news__item-meta-item-person-icon">
                                    <CgProfile />
                                </span>
                                <span className="news__item-meta-item-person-prefix">
                                    {getTranslate("news", "by")}
                                </span>
                                <Link className="news__item-meta-item-person-link">
                                    {author}
                                </Link>
                            </div>
                            <div className="news__item-meta-item-categories">
                                <span className="news__item-meta-item-categories-icon">
                                    <CiFolderOn />
                                </span>
                                <Link className="news__item-meta-item-categories-link">
                                    {category}
                                </Link>
                            </div>
                        </li>
                    </ul>
                    <div className="news__item-meta-details">
                        <div className="news__item-meta-details-heading">
                            <Link 
                                to={`/news/${item?.slug}`}
                                className="news__item-meta-details-heading-link"
                            >
                                {item?.title || 'Untitled'}
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="news__item-meta-link">
                    <HoverLink
                        to={`/news/${item?.slug}`}
                        className="news__item-meta-link-action"
                        variant="gold"
                    >
                        <h4 className="news__item-meta-link-title">
                            {getTranslate("news", "readMore")}
                        </h4>
                        <span className="news__item-meta-link-icon">
                            <FaArrowAltCircleRight />
                        </span>
                    </HoverLink>
                </div>
            </div>
        </div>
    )
}

export default NewsItemMeta;