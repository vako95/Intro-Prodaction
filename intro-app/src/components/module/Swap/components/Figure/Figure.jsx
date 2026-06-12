import { memo } from 'react';
import { ImageWithFallback } from "@/components/shared";
import { useLang } from "@hooks/useLang";
import "./Figure.css";

const Figure = memo(({ poster, alt }) => {
    const { getTranslate } = useLang();
    
    return (
        <figure className="swap__figure">
            <div className="swap__figure-wrapper">
                <ImageWithFallback
                    src={poster}
                    alt={alt || getTranslate("altTexts", "swapImage")}
                    className="swap__figure-img"
                    fallback="/placeholder-swap.jpg"
                />
            </div>
        </figure>
    );
});

Figure.displayName = 'Figure';

export default Figure;
