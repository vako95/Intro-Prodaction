import "./NewsFeedList.css";
import "./NewsFeedList-responsive.css";

const NewsFeedList = ({ children }) => {

    return (
        <ul className="news-feed__list">
            {children}
        </ul>
    )
}

export default NewsFeedList;