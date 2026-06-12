import "./NewsItem.css";
import NewsItemBackdrop from "./components/NewsItemBackdrop/NewsItemBackdrop";
import NewsItemMeta from "./components/NewsItemMeta/NewsItemMeta";

const NewsItem = ({ item }) => {
    return (
        <div className="news__item">
            <div className="news__item-container">
                <NewsItemMeta item={item} />
            </div>
            <div className="news__item-backdrop-wrapper">
                <NewsItemBackdrop image={item.poster} />
            </div>
        </div>
    )
}

export default NewsItem;