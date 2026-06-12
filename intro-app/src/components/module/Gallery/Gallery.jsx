import "./Gallery.css";
import { useState } from "react";
import { Container } from "@components/ui";
import Lightbox from "yet-another-react-lightbox";
import { useGalleryQuery } from "../../../hooks/useGallery";
import { useLang } from "@hooks/useLang";

import "yet-another-react-lightbox/styles.css";

import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const fallbackImages = [
    { id: 1, src: "https://dev24.kodesolution.com/hoexr/wp-content/uploads/2023/11/bg4.jpg" },
    { id: 2, src: "https://dev24.kodesolution.com/hoexr/wp-content/uploads/2023/11/bg4.jpg" },
    { id: 3, src: "https://dev24.kodesolution.com/hoexr/wp-content/uploads/2023/11/bg4.jpg" },
    { id: 4, src: "https://dev24.kodesolution.com/hoexr/wp-content/uploads/2023/11/bg4.jpg" },
];

const Gallery = () => {
    const { getTranslate } = useLang();
    const { data: galleryImages, isLoading, isError } = useGalleryQuery();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const handleOpen = (idx) => {
        setIndex(idx);
        setOpen(true);
    };

    // Use API data if available, otherwise fallback to static data
    const displayImages = galleryImages && galleryImages.length > 0 ? galleryImages : fallbackImages;

    return (
        <Container>
            <div className="gallery">
                <div className="gallery__card">
                    {displayImages.map((item, idx) => (
                        <div className="gallery__card-wrapper" key={item.id} onClick={() => handleOpen(idx)}>
                            <img 
                                src={item.thumbnail || item.src} 
                                alt={item.title || `${getTranslate("gallery", "image")} ${item.id}`} 
                                className="gallery__card-img" 
                            />
                        </div>
                    ))}
                </div>

                <Lightbox
                    counter={{ container: { style: { top: "unset", bottom: 0 } } }}
                    open={open}
                    close={() => setOpen(false)}
                    index={index}
                    slides={displayImages.map((item) => ({
                        src: item.image || item.src,
                        alt: item.title || `${getTranslate("gallery", "image")} ${item.id}`,
                    }))}
                    plugins={[Download, Slideshow, Counter, Thumbnails, Video, Zoom]}
                    styles={{
                        container: { backgroundColor: "rgba(0, 0, 0, .9)", zIndex: 9999999 },
                        root: { zIndex: 9999999 }
                    }}
                    portal={{ root: document.body }}
                />
            </div>
        </Container>
    );
};

export default Gallery;
