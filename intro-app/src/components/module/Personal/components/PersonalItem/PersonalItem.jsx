import { Link } from "react-router-dom";

import "./PersonalItem.css";
import "./PersonalItem-responsive.css";
import { ICON_MAP } from "@constants/map.js";



const PersonalItem = ({ item }) => {

    return (
        <article className="personal__list-profile">
            <figure className="personal__list-frame">
                <img 
                    className="personal__list-frame-cover" 
                    src={item.poster} 
                    alt={item.name}
                    loading="lazy"
                />
                {item.social && item.social.length > 0 && (
                    <nav className="personal__list-icons" aria-label="Social media links">
                        {item.social.map((icon, idx) => {
                            const Icon = ICON_MAP[icon] ?? ICON_MAP["default"];

                            return (
                                <Link
                                    key={idx}
                                    to={icon.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="personal__list-icon-link"
                                    aria-label={`${icon.platform || 'Social'} profile`}
                                >
                                    <Icon className="personal__list-icon" aria-hidden="true" />
                                </Link>
                            )
                        })}
                    </nav>
                )}
            </figure>
            <div className="personal__list-content">
                <div className="personal__list-member">
                    <h5 className="personal__list-member-title">
                        {item?.role}
                    </h5>
                    <Link to={`/personal/${item.slug}`} className="personal__list-member-link">
                        {item?.name}
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default PersonalItem;