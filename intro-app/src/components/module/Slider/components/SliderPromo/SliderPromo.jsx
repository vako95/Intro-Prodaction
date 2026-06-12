import { memo } from 'react';
import { BackInUp, FadeInRight, FadeInLeft, BackInDown } from "@components/animation";
import { DecoratedHeading, HoverLink } from "@components/ui";
import { ImageWithFallback } from "@/components/shared";
import { useLang } from "@hooks/useLang";
import "./SliderPromo.css";

const SliderPromo = memo(({ currentSlide, item }) => {
    const { getTranslate } = useLang();
    
    if (!item) return null;

    return (
        <div className="slider__promo" tabIndex={4}>
            <BackInDown trigger={currentSlide}>
                <div className="slider__promo-logo">
                    <ImageWithFallback
                        src={item?.brand?.logo}
                        alt={item?.brand?.name || getTranslate("altTexts", "brandLogo")}
                        className="slider__promo-logo-img"
                        fallback="/placeholder-logo.png"
                    />
                </div>
            </BackInDown>
            <div className="slider__promo-header">
                <FadeInLeft trigger={currentSlide}>
                    <DecoratedHeading
                        className="slider__promo-title"
                        showLeftIcon={false}
                        showRightIcon={false}
                        title={item?.title}
                    />
                </FadeInLeft>
                <FadeInRight trigger={currentSlide}>
                    <span className="slider__promo-content">
                        {item?.subtitle}
                    </span>
                </FadeInRight>
            </div>
            <div className="slider__promo-link">
                <BackInUp trigger={currentSlide}>
                    <HoverLink
                        size="md"
                        variant="silver"
                        border={true}
                        color="white"
                    >
                        {getTranslate("nav", "roomsSuites")}
                    </HoverLink>
                </BackInUp>
            </div>
        </div>
    );
});

SliderPromo.displayName = 'SliderPromo';

export default SliderPromo;
