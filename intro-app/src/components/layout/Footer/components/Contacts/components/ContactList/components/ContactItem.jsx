import { Link } from "react-router-dom";
import { ICON_MAP } from "../../../../../../../../constants/map.js";

import "./ContactItem.css";

const ContactItem = ({ item }) => {
    const Icon = ICON_MAP[item.icon] ?? ICON_MAP["default"];


    return (
        <li className="footer__contact-item">
            <Link className="footer__contact-link">
                <span className="footer__contact-link-icon">
                    <Icon />
                </span>
                <span className="footer__contact-title">
                    {item.label}
                </span>
            </Link>
        </li>
    )
}

export default ContactItem;
// const contactNav = [
//     {
//         id: 1,
//         icon: "ri-phone-line",
//         name: "1800-121-3637",

//     },
//     {
//         id: 2,
//         icon: "ri-mail-send-fill",
//         name: "needhelp@company.com",
//     },
//     {
//         id: 3,
//         icon: "ri-map-pin-line",
//         name: "1247/Plot No. 39, 15th Phase, United States of America",
//     },
// ];
