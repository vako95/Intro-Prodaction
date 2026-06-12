import { IconMirror } from "@components/animation";
import "./AdvantagesBarItem.css";

const AdvantagesBarItem = ({ item }) => {

    return (
        <IconMirror>
            <div className="advantages-bar__item">
                <div className="advantages-bar__item-cover">
                    <img className="anime-mirror advantages-bar__item-cover-icon" src={item.icon} alt={item.title} />
                </div>
                <div className="advantages-bar__item-content">
                    <h5 className="advantages-bar__item-content-title">
                        {item.title}
                    </h5>
                    <span className="advantages-bar__item-content-desc">
                        {item.description}
                    </span>
                </div>
            </div>
        </IconMirror>
    )
}

export default AdvantagesBarItem;