import Heading from "./components/Heading/Heading";
import "./QuoteItem.css";
import { FaCheck } from "react-icons/fa";
import slowDown from "./img/bg-shape-1.png";
const QuoteItem = ({ item }) => {

    const { name, position, image, quote } = item;
    return (
        <li className="quote__item" style={{ backgroundImage: `url("${slowDown}")` }}>
            <div className="quote__item-heading">
                <h1 className="quote__item-heading-name">
                    {name}
                </h1>
                <span className="quote__item-heading-role">
                    {position}
                </span>
            </div>
            <div className="quote__item-wrapper">
                <img className="quote__item-wrapper-img" src={image} alt="" />
                {item && (
                    <span className="quote__item-check">
                        <span className="quote__item-wrapper-icon">
                            <FaCheck className="quote__item-wrapper-icons" />
                        </span>
                    </span>
                )}
            </div>
            <p className="quote__item-desc">
                {quote}
            </p>
        </li>
    )
}

export default QuoteItem;