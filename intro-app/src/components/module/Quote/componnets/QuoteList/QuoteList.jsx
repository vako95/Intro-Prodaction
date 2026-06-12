import QuoteItem from "./components/QuoteItem/QuoteItem";
import "./QuoteList.css";


const QuoteList = ({ quotes }) => {
    
    const quotesList = quotes?.results || quotes || [];
    
    return (
        <ul className="quote__list">
            {quotesList.map((item, idx) => (
                <QuoteItem item={item} key={idx} />
            ))}
        </ul>
    )
}

export default QuoteList;