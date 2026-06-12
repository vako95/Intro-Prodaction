import { memo } from 'react';
import { ImageWithFallback } from "@/components/shared";
import "./NewsItemBackdrop.css";
import Noimage from "./assets/img/No_image_available.svg.png";

const NewsItemBackdrop = memo(({ image }) => {

    return (
        <div className="news__item-backdrop">
            <ImageWithFallback
                src={image}
                alt={""}
                className="news__item-backdrop-img"
                fallback={Noimage}
            />
        </div>
    );
});

NewsItemBackdrop.displayName = 'NewsItemBackdrop';

export default NewsItemBackdrop;
