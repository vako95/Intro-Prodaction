import { Link } from "react-router-dom";
import { ICON_MAP } from "../../../../../../../../../../constants/map.js";
import "./SocialItem.css";

const SocialItem = ({ item }) => {
    const Icon = ICON_MAP[item.icon] ?? ICON_MAP["default"];

    return (
        <li className="footer__about-social-item">
            <Link className="footer__about-social-link">
                <span className="footer__about-social-link-icon">
                    <Icon />
                </span>
            </Link>
        </li>
    )
}

export default SocialItem;