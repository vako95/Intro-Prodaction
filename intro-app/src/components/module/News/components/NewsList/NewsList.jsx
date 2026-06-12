import "./NewsList.css";
import NewsItem from "../NewsItem/NewsItem.jsx";


const NewsList = ({ children }) => {
    return (
        <div className="news__list">
            {children}
        </div>
    )
}

export default NewsList;