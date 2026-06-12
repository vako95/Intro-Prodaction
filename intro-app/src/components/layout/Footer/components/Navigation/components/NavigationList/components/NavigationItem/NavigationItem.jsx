import { Link } from "react-router-dom";
import { ICON_MAP } from "../../../../../../../../../constants/map.js";
import "./NavigationItem.css";

const NavigationItem = ({ item }) => {
    const Icon = ICON_MAP[item.icon] ?? ICON_MAP["default"];
    return (
        <li className="footer__navigation-item">
            <Link className="footer__navigation-link" to="">
                <span className="footer__navigation-link-icon">
                    <Icon />
                </span>
                <span className="footer__navigation-link-title">
                    {item.name}
                </span>
            </Link>
        </li>
    )
}

export default NavigationItem;


