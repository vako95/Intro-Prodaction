import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Parallax, Autoplay, EffectFade } from 'swiper/modules';
import { useRef, useState, Fragment } from "react";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import "./Slider.css";

import SliderPromo from './components/SliderPromo/SliderPromo.jsx';
import SliderFrame from '../../ui/SliderFrame/SliderFrame.jsx';
import { Manager, Skeleton } from "@/state";
import { useHeroSliderQuery } from '../../../hooks/useHeroSlider.js';
import { useLang } from "@hooks/useLang";


const SwiperModule = ({ items, currentSlide, setCurrentSlide, children, getTranslate }) => {
    const swiperRef = useRef(null);
    const [hoveredButton, setHoveredButton] = useState(null);

    const getPrevIndex = () => (currentSlide - 1 + items.length) % items.length;
    const getNextIndex = () => (currentSlide + 1) % items.length;

    const prevPoster = items[getPrevIndex()]?.poster;
    const nextPoster = items[getNextIndex()]?.poster;

    return (
        <Swiper
            simulateTouch={false}
            onSwiper={(swiper) => {
                swiperRef.current = swiper;
                swiper.slideToLoop(currentSlide, 0);
            }}
            onRealIndexChange={(swiper) => setCurrentSlide(swiper.realIndex)}
            loop
            className="mySwiper"
            navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            }}
            modules={[Navigation, Parallax, Autoplay, EffectFade]}
        >
            {children}
            <div
                className="swiper-button-prev"
                onMouseEnter={() => setHoveredButton("prev")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => swiperRef.current?.slideToLoop(getPrevIndex())}
            >
                <img
                    className={`swiper__preview-img ${hoveredButton === "prev" ? "swiper__preview-img--active" : ""}`}
                    src={prevPoster}
                    alt={getTranslate("altTexts", "prevPreview")}
                    loading="eager"
                    decoding="async"
                />
            </div>

            <div
                className="swiper-button-next"
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={() => swiperRef.current?.slideToLoop(getNextIndex())}
            >
                <img
                    className={`swiper__preview-img ${hoveredButton === "next" ? "swiper__preview-img--active" : ""}`}
                    src={nextPoster}
                    alt={getTranslate("altTexts", "nextPreview")}
                    loading="eager"
                    decoding="async"
                />
            </div>
        </Swiper>
    );
};

const Slider = () => {
    const { getTranslate } = useLang();
    const [currentSlide, setCurrentSlide] = useState(0);
    const { data: hero_slider, isLoading, isError } = useHeroSliderQuery();

    return (
        <div className="slider">
            <Manager
                items={hero_slider}
                isLoading={isLoading}
                isError={isError}
                unavailableProps={{
                    title: getTranslate("messages", "error"),
                    message: getTranslate("messages", "noData"),
                }}
                skeletonWrapper={Fragment}
                skeletonCustom={
                    <div className="slider__skeleton">
                        <div className="slider__skeleton-frame" >
                            <Skeleton as={"div"} count={"1"} id="slider__promo-logo" />
                        </div>
                        <div className="slider__skeleton-content" >
                            <Skeleton as={"div"} count={"1"} id="slider__promo-title" />
                            <Skeleton as={"div"} count={"1"} id="slider__promo-subtitle" />
                            <Skeleton as={"div"} count={"1"} id="slider__promo-action" />
                            <Skeleton as={"div"} count={"1"} id="swiper__skeleton-preview-prev" />
                            <Skeleton as={"div"} count={"1"} id="swiper__skeleton-preview-next" />
                        </div>
                    </div>
                }
                renderMap={(item, idx) => (
                    <SwiperSlide key={item.id} className="slider__frame">
                        <SliderFrame src={item.poster} isActive={currentSlide === idx}>
                            <SliderPromo item={item} currentSlide={currentSlide === idx} />
                        </SliderFrame>
                    </SwiperSlide>
                )}
                renderWrapper={(props) => (
                    <SwiperModule
                        items={hero_slider}
                        currentSlide={currentSlide}
                        setCurrentSlide={setCurrentSlide}
                        getTranslate={getTranslate}
                        {...props}
                    />
                )}
            />
        </div>
    );
};

export default Slider;