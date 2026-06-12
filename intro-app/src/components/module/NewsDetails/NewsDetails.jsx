import "./NewsDetails.css";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { Manager, Skeleton } from "@/state";
import { useNewsDetailQuery, useLatestNewsQuery } from "@/hooks/news.js";
import { useTagsQuery, useCategoriesQuery } from "@/hooks/useTags.js";
import { Container, Comment, InputSearch, LastNews, NewsCategories, NewsTag } from "@components/ui";
import { IoPersonCircleOutline } from "react-icons/io5";
import { IoCalendarClearOutline } from "react-icons/io5";
import { FaRegComments } from "react-icons/fa6";
import { ImageWithFallback } from "@/components/shared";
import { useLang } from "@hooks/useLang";
import { useBreadcrumbTitle } from "@/hooks/useBreadcrumbTitle";

import bgShape from "./assets/img/backdrop/bg-shape-1.png";

const NewsDetails = () => {
    const { getTranslate } = useLang();
    const { slug } = useParams();
    const { data: newsItem, isLoading, isError } = useNewsDetailQuery(slug);
    const { data: tags = [] } = useTagsQuery();
    const { data: categories = [] } = useCategoriesQuery();
    const { data: latestNews = [] } = useLatestNewsQuery(4);
    
   
    useBreadcrumbTitle(newsItem?.title);

    const author = typeof newsItem?.author === 'object'
        ? (newsItem.author.first_name || newsItem.author.username || 'Admin')
        : (newsItem?.author || 'Admin');

    const category = typeof newsItem?.category === 'object'
        ? (newsItem.category.title || newsItem.category.name || 'News')
        : (newsItem?.category || 'News');

    const latestNewsItems = latestNews.map(item => ({
        id: item.id,
        title: item.title,
        date: dayjs(item.created_at).format('MMMM DD, YYYY'),
        src: item.poster || item.image,
        link: `/news/${item.slug}`,
        alt: item.title
    }));

    if (isLoading) {
        return (
            <div className="news-backdrop" style={{ backgroundImage: `url(${bgShape})` }}>
                <Container>
                    <div className="news-details__skeleton">
                        <Skeleton as="div" count={1} className="news-details__skeleton-image" />
                        <Skeleton as="div" count={5} className="news-details__skeleton-text" />
                    </div>
                </Container>
            </div>
        );
    }

    if (isError || !newsItem) {
        return (
            <div className="news-backdrop" style={{ backgroundImage: `url(${bgShape})` }}>
                <Container>
                    <div className="news-details__error">
                        <h2>{getTranslate("messages", "error")}</h2>
                        <p>{getTranslate("news", "failedToLoadNews")}</p>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="news-backdrop" style={{ backgroundImage: `url(${bgShape})` }}>
            <Container>
                <div className="news-details">
                    <div className="news-details__columns">
                        <div className="news-details__column news-details__column--left">
                            <div className="news-details__cover">
                                <ImageWithFallback
                                    className="news-details__cover-img"
                                    src={newsItem?.poster}
                                    alt={newsItem?.title}
                                    fallback="/placeholder-news.jpg"
                                />
                            </div>
                            <div className="news-details__content">
                                <div className="news-details__heading">
                                    <h2 className="news-details__heading-title">
                                        {newsItem?.title}
                                    </h2>
                                </div>
                                {newsItem?.content ? (
                                    <div
                                        className="news-details__content-text"
                                        dangerouslySetInnerHTML={{ __html: newsItem.content }}
                                    />
                                ) : (
                                    <p className="news-details__paragraph">
                                        {newsItem?.description || newsItem?.excerpt}
                                    </p>
                                )}
                            </div>
                            <div className="news-details__meta">
                                <ul className="news-details__meta-list">
                                    <li className="news-details__meta-item">
                                        <Link className="news-details__meta-link">
                                            <span className="news-details__meta-link-icon">
                                                <IoPersonCircleOutline />
                                            </span>
                                            <span className="news-details__meta-link-title">
                                                {author}
                                            </span>
                                        </Link>
                                    </li>
                                    <li className="news-details__meta-item">
                                        <Link className="news-details__meta-link">
                                            <span className="news-details__meta-link-icon">
                                                <IoCalendarClearOutline />
                                            </span>
                                            <span className="news-details__meta-link-title">
                                                <time className="news-details__meta-link-title-date" dateTime={newsItem?.date}>
                                                    {dayjs(newsItem?.date).format('MMMM DD, YYYY')}
                                                </time>
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="news-details__info">
                                <div className="news-details__info-category">
                                    <h2 className="news-details__info-category-title">
                                        {getTranslate("news", "postedIn")}
                                    </h2>
                                    <Link 
                                        to={`/news?category=${typeof newsItem?.category === 'object' ? (newsItem.category.slug || newsItem.category.id) : newsItem?.category}`}
                                        className="news-details__info-category-link"
                                    >
                                        {category}
                                    </Link>
                                </div>
                                {newsItem?.tag?.length > 0 && (
                                    <div className="news-details__info-tag">
                                        <h2 className="news-details__info-tag-title">
                                            {getTranslate("news", "tags")}
                                        </h2>
                                        {newsItem.tag.map((tag, idx) => (
                                            <Link 
                                                key={idx} 
                                                to={`/news?tag=${typeof tag === 'object' ? (tag.slug || tag.id) : tag}`}
                                                className="news-details__info-tag-link"
                                            >
                                                {typeof tag === 'object' ? tag.name || tag.title : tag}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Comment 
                                newsId={newsItem?.id}
                                comments={newsItem?.comments || []}
                                commentsCount={newsItem?.comments_count || 0}
                            />
                        </div>

                        <div className="news-details__column news-details__column--right">
                            <div className="news-details__toolbar">
                                <InputSearch />
                                <LastNews
                                    title={getTranslate("news", "latestNews")}
                                    items={latestNewsItems}
                                />
                                <NewsCategories
                                    title={getTranslate("news", "categories")}
                                    items={categories.map(cat => ({
                                        id: cat.id,
                                        slug: cat.slug,
                                        title: cat.title,
                                        count: cat.news_count || 0
                                    }))}
                                />
                                <NewsTag
                                    title={getTranslate("news", "tags")}
                                    items={tags.map(tag => ({
                                        id: tag.id,
                                        slug: tag.slug,
                                        tag: tag.name
                                    }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default NewsDetails;