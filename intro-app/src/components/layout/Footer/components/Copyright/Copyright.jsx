import { Link } from "react-router-dom";
import { useLang } from "@hooks/useLang";
import "./Copyright.css";

const Copyright = () => {
    const { getTranslate } = useLang();
    
    return (
        <div className="footer__copyright">
            <div className="footer__copyright-about">
                <small>{getTranslate("footer", "copyright")}</small>
            </div>
            <div className="footer__copyright-social">
                <Link className="footer__copyright-link" to="https://github.com/vako95">
                    <i className="ri-github-line"></i>
                    vako95
                </Link>
            </div>
        </div>
    );
};

export default Copyright;
