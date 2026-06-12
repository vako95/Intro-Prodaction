import SubsciribeForm from "./components/SubscribeForm/SubscribeForm";
import { useLang } from "@hooks/useLang";
import "./Subscribe.css";

const Subscribe = () => {
    const { getTranslate } = useLang();

    return (
        <div className="footer__subscribe">
            <div className="footer__subscribe-heading">
                <h5 className="footer__subscribe-title">{getTranslate("footer", "newsletter")}</h5>
                <p className="footer__subscribe-desc">{getTranslate("footer", "newsletterDesc")}</p>
            </div>

            <div className="footer__subscribe-content">
                <SubsciribeForm />
            </div>
        </div>
    )
}

export default Subscribe;