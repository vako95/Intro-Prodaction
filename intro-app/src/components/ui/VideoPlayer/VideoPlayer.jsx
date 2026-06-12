import clsx from "clsx";

import "./VideoPlayer.css";
import ZoomInUp from "../../animation/ZoomInUp/ZoomInUp";
import { useLang } from "@hooks/useLang";

const VideoPlayer = ({ className, videoId, size = "md", border = true }) => {
    const { getTranslate } = useLang();

    const classes = clsx(
        "iframe",
        border && "iframe-border",
        className
    );

    return (
        <ZoomInUp className="iframe-zoom" isVisible={true}>
            <div className="iframe-ambient-wrapper">
                <iframe
                    className={classes}
                    src={videoId}
                    title={getTranslate("gallery", "videoPlayer")}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        </ZoomInUp>
    );
}

export default VideoPlayer;
