import { Container } from "@components/ui";
import NewsList from "./components/NewsList/NewsList";
import { Manager } from "@/state"
import { useNewsQuery } from "../../../hooks/news.js";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useLang } from "@hooks/useLang";

import "./News.css";
import NewsItem from "./components/NewsItem/NewsItem.jsx";

const News = () => {
    const { getTranslate } = useLang();
    const [searchParams] = useSearchParams();
    const { data: news = [], isLoading, isError } = useNewsQuery();
    
    const tagId = searchParams.get('tag');
    const categoryId = searchParams.get('category');

    const filteredNews = useMemo(() => {
        if (!news || news.length === 0) return [];
        
        let filtered = [...news];
        
        if (categoryId) {
            filtered = filtered.filter(item => {
                if (typeof item.category === 'object' && item.category !== null) {
                    return String(item.category.id) === String(categoryId) || 
                           String(item.category.slug) === String(categoryId);
                }
                return String(item.category) === String(categoryId);
            });
        }
        
        if (tagId) {
            filtered = filtered.filter(item => {
                const tags = item.tag || item.tags || [];
                if (!Array.isArray(tags) || tags.length === 0) return false;
                
                return tags.some(tag => {
                    if (typeof tag === 'object' && tag !== null) {
                        return String(tag.id) === String(tagId) || 
                               String(tag.slug) === String(tagId);
                    }
                    return String(tag) === String(tagId);
                });
            });
        }
        
        return filtered;
    }, [news, tagId, categoryId]);

    return (
        <div className="news">
            <Container>
                {(tagId || categoryId) && (
                    <div className="news__filter-info">
                        <p>
                            {categoryId && getTranslate("news", "filteredByCategory")}
                            {tagId && getTranslate("news", "filteredByTag")}
                        </p>
                    </div>
                )}
                <Manager
                    isLoading={isLoading}
                    isError={isError}
                    skeletonProps={{
                        id: "news-skeleton",
                        as: "div",
                        count: 4,
                    }}
                    unavailableProps={{
                        className: "news__unavailable",
                        title: getTranslate("messages", "error"),
                        description: getTranslate("news", "failedToLoadNews"),
                    }}
                    emptyProps={{
                        title: getTranslate("messages", "noData"),
                        description: getTranslate("news", "noNewsFound"),
                    }}
                    renderWrapper={NewsList}
                    skeletonWrapper={NewsList}
                    items={filteredNews}
                    renderMap={
                        (item) => (
                            <NewsItem
                                key={item.id}
                                item={item}
                            />
                        )
                    }
                />
            </Container>
        </div>
    )
}

export default News;