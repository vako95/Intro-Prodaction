import "./OverlayContent.css";
import { DecoratedHeading } from "@components/ui";
import { useLang } from "@hooks/useLang";

const OverlayContent = ({ title, subtitle }) => {
    const { getTranslate } = useLang();
    
    return (
        <article className="overlay__section overlay__section--left">
            <div className="overlay__content">
                <div className="overlay__heading">
                    <DecoratedHeading
                        position="start"
                        showLeftIcon={false}
                        showRightIcon={true}
                        title={title || getTranslate("overlay", "promotionalVideo")}
                        subtitle={subtitle || getTranslate("overlay", "bookHotelDeals")}
                    />
                </div>
            </div>
        </article>
    );
};

export default OverlayContent;

