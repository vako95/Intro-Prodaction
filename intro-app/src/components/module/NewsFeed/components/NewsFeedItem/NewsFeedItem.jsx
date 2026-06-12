import { memo } from 'react';
import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/shared";
import { useLang } from "@hooks/useLang";
import "./NewsFeedItem.css";
import "./NewsFeedItem-responsive.css";

const NewsFeedItem = memo(({ item }) => {
    const { getTranslate } = useLang();
    
    if (!item) return null;

    return (
        <li className="news-feed__item">
            <div className="news-feed__item-wrapper">
                <div className="news-feed__thumbs">
                    <div className="news-feed__thumb">
                        <ImageWithFallback
                            src={item.poster}
                            alt={item.title}
                            className="news-feed__img"
                            fallback="/placeholder-news.jpg"
                            loading="lazy"
                        />
                    </div>
                    <div className="news-feed__thumb">
                        <ImageWithFallback
                            src={item.poster}
                            alt={item.title}
                            className="news-feed__img"
                            fallback="/placeholder-news.jpg"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
            <div className="news-feed__item-content">
                <div className="news-feed__item-content-item">
                    <div className="news-feed__item-date">
                        <div className="news-feed__item-date-box" aria-label={`Posted on ${item.date?.day} ${item.date?.month} ${item.date?.year}`}>
                            <div className="news-feed__item-day">
                                <time className="news-feed__time-day" dateTime={item.date?.day}>
                                    {item.date?.day}
                                </time>
                            </div>
                            <div className="news-feed__item-month-year">
                                <time className="news-feed__time-month" dateTime={item.date?.month}>
                                    {item.date?.month}
                                </time>
                                <time className="news-feed__time-year" dateTime={item.date?.year}>
                                    {item.date?.year}
                                </time>
                            </div>
                        </div>
                    </div>
                    <ul className="news-feed__item-meta-list">
                        <li className="news-feed__item-meta-item">
                            <i className="news-feed__item-meta-icon ri-account-circle-line" aria-hidden="true"></i>
                            <span className="news-feed__item-meta-link" aria-label={`Author: ${item.author}`}>{item.author}</span>
                        </li>
                        <li className="news-feed__item-meta-item">
                            <i className="news-feed__item-meta-icon ri-folder-line" aria-hidden="true"></i>
                            <span className="news-feed__item-meta-link" aria-label={`Category: ${item.category}`}>{item.category}</span>
                        </li>
                    </ul>
                    <div className="news-feed__item-more">
                        <div className="news-feed__item-links">
                            <Link to={`/news/${item.slug}`} className="news-feed__item-link">
                                {item.title}
                            </Link>
                        </div>
                        <div className="news-feed__item-actions">
                            <Link to={`/news/${item.slug}`} className="news-feed__item-actions-link">
                                {getTranslate("feature", "readMore")}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
});

NewsFeedItem.displayName = 'NewsFeedItem';

export default NewsFeedItem;
