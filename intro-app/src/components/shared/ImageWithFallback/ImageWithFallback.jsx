import { useState, memo } from 'react';
import './ImageWithFallback.css';

const ImageWithFallback = memo(({
    src,
    alt,
    fallback = '/No_image_available.svg.png',
    className = '',
    onLoad,
    onError,
    ...props
}) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleLoad = (e) => {
        setIsLoading(false);
        onLoad?.(e);
    };

    const handleError = (e) => {
        setIsLoading(false);
        setHasError(true);
        onError?.(e);
    };

    return (
        <div className={`image-with-fallback ${className}`}>
            {isLoading && (
                <div className="image-with-fallback__skeleton" />
            )}
            <img
                src={imgSrc || fallback}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                className={`image-with-fallback__img ${isLoading ? 'image-with-fallback__img--loading' : ''} ${hasError ? 'image-with-fallback__img--error' : ''}`}
                loading="lazy"
                {...props}
            />
        </div>
    );
});

ImageWithFallback.displayName = 'ImageWithFallback';

export default ImageWithFallback;
