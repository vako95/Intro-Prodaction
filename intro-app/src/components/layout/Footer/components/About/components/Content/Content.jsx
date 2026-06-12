import { useLang } from "@hooks/useLang";
import "./Content.css";

const Content = () => {
    const { getTranslate } = useLang();

    return (
        <div className="footer__about-content">
            <h6 className="footer__about-content-title">
                {getTranslate("footer", "aboutText")}
            </h6>
        </div>
    )
}

export default Content;