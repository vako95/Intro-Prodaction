import "./Overlay.css";
import overBackdrop from "./assets/img/1.jpg";
import { Container } from "@components/ui";
import OverlayContent from "./components/OverlayContent/OverlayContent";
import OverlayPlayer from "./components/OverlayPlayer/OverlayPlayer";
import { usePromotionalVideoQuery } from "../../../hooks/usePromotionalVideo";

const Overlay = () => {
    const { data: video, isLoading, isError } = usePromotionalVideoQuery();

    if (isLoading || isError || !video) {
        return null;
    }

    const { title, subtitle, videoUrl, backgroundImage } = video;
    const backdrop = backgroundImage || overBackdrop;

    return (
        <section className="overlay">
            <div className="overlay__backdrop" style={{ backgroundImage: `url(${backdrop})` }}>
                <Container>
                    <div className="overlay__container">
                        <OverlayContent title={title} subtitle={subtitle} />
                        <OverlayPlayer videoUrl={videoUrl} />
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default Overlay;
