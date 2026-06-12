import { Link } from "react-router-dom";
import { ICON_MAP } from "@constants/map.js";
import "./Socials.css";

const Socials = ({ member }) => {

    return (
        <ul className="personal__detail-info-socials">
            {member?.social && member.social?.map((social) => {

                const Icon = ICON_MAP[social.icon] ?? ICON_MAP["default"];

                return (
                    <li key={social.id} className="personal__detail-info-social">
                        <Link
                            to={social.url || '#'}
                            className="personal__detail-info-social-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            title={social.title}
                        >
                            <Icon className="personal__detail-info-social-icon" />
                        </Link>
                    </li>
                );
            })}
        </ul>
    )
}

export default Socials;