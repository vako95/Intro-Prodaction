import { Link } from "react-router-dom";

import "./Content.css";
const Content = () => {

    return (
        <article className="personal__detail-content">
            <div className="personal__detail-content-heading">
                <h2 className="personal__detail-name">Frank Bruton</h2>
                <p className="personal__detail-desc">
                    Bring to the table win-win survival strategies to ensure proactive which domination.
                    At the end of the day going new normal
                </p>
            </div>

            <ul className="personal__detail-info-socials">
                <li className="personal__detail-info-social">
                    <Link className="personal__detail-info-social-link">
                        <i className="personal__detail-info-social-icon ri-twitter-x-fill"></i>
                    </Link>
                </li>
                <li className="personal__detail-info-social">
                    <Link className="personal__detail-info-social-link">
                        <i className="personal__detail-info-social-icon ri-facebook-fill"></i>
                    </Link>
                </li>
                <li className="personal__detail-info-social">
                    <Link className="personal__detail-info-social-link">
                        <i className="personal__detail-info-social-icon ri-youtube-fill"></i>
                    </Link>
                </li>
                <li className="personal__detail-info-social">
                    <Link className="personal__detail-info-social-link">
                        <i className="personal__detail-info-social-icon ri-instagram-fill"></i>
                    </Link>
                </li>
            </ul>
        </article>
    )
}

export default Content;