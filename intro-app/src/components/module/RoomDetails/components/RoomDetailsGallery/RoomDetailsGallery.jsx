import { useState } from "react";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { useLang } from "@hooks/useLang";
import "./RoomDetailsGallery.css";
import { slicetext } from "@utils";
import { useRoomBySlug } from "../../../../../hooks/useAPI.js";

const RoomDetailsGallery = () => {
    const { slug } = useParams();
    const { data: roomData, isLoading, error } = useRoomBySlug(slug);
    const { getTranslate } = useLang();
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClick = (index) => {
        setCurrentIndex(index);
        setOpen(true);
    };

    if (isLoading) {
        return (
            <div className="room-details__gallery">
                <div className="room-details__gallery-heading">
                    <h2 className="room-details__gallery-heading-title">{getTranslate("roomDetails", "aroundTheRoom")}</h2>
                </div>
                <div className="room-details__gallery-loading">{getTranslate("roomDetails", "loadingGallery")}</div>
            </div>
        );
    }

    if (error || !roomData) {
        return null;
    }

    const room = roomData;
    
    const galleryImg = room.images && room.images.length > 0 
        ? room.images.map(img => ({
            id: img.id,
            src: img.image,
            title: room.title
          }))
        : [];

    if (galleryImg.length === 0) {
        return null;
    }
    return (
        <div className="room-details__gallery">
            <div className="room-details__gallery-heading">
                <h2 className="room-details__gallery-heading-title">
                    {getTranslate("roomDetails", "aroundTheRoom")}
                </h2>
            </div>
            <div className="room-details__gallery-card">
                {galleryImg.map((item, index) => (
                    <div key={item.id} className="room-details__gallery-card-content">
                        <div className="room-details__gallery-card-wrapper" onClick={() => handleClick(index)}>
                            <img className="room-details__gallery-card-wrapper-img" src={item.src} alt={item.title} />
                        </div>
                        <div className="room-details__gallery-card-preview">
                            <h2
                                className="room-details__gallery-card-preview-title"
                                data-tooltip-id="my-tooltip"
                                data-tooltip-content={item.title}
                            >
                                {slicetext(item.title, 24)}
                            </h2>
                        </div>
                    </div>
                ))}


                <Lightbox
                    counter={{ container: { style: { top: "unset", bottom: 0 } } }}
                    open={open}
                    index={currentIndex}
                    close={() => setOpen(false)}
                    slides={galleryImg.map((item) => ({
                        src: item.src,
                        alt: item.title,
                    }))}
                    plugins={[Download, Slideshow, Counter, Captions, Thumbnails, Video, Zoom]}
                />
            </div>
        </div>
    )
}

export default RoomDetailsGallery;