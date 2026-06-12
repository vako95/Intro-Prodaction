
import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import clsx from "clsx";

import "swiper/css";
import "swiper/css/effect-creative";
import "./GallerySlider.css";

import { EffectCreative } from "swiper/modules";

const GallerySlider = ({
    items = [],
    src,
    title,
    alt = "",
    maxHeight,
    maxWidth,
    className,
    style,
    ...props
}) => {

    const classes = clsx(
        "slider-creative",
        className,
    )
    const styleSlider = {
        ...(maxWidth && { '--maxWidth': `${maxWidth}px` }),
        ...(maxHeight && { '--maxHeight': `${maxHeight}px` }),
    };

    return (
        <div className={classes} style={styleSlider} {...props}>
            <Swiper
                grabCursor={true}
                effect={"creative"}
                creativeEffect={{
                    prev: {
                        shadow: true,
                        translate: [0, 0, -400],
                    },
                    next: {
                        translate: ["100%", 0, 0],
                    },
                }}
                modules={[EffectCreative]}
                className="slider-creative__swiper"
            >
                {items.map((item) => (
                    <SwiperSlide key={item.id} className="slider-creative__swiper-frame" >
                        <img className="slider-creative__swiper-frame-img"
                            src={item.src}
                            alt={alt || ""}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div >
    );
}

export default GallerySlider;
