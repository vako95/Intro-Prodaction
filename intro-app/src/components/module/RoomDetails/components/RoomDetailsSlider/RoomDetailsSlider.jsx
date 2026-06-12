import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useLang } from "@hooks/useLang";

import "./RoomDetailsSlider.css";
import { HotelCarousel } from "@components/ui";
import { useRooms } from "../../../../../hooks/useAPI.js";

const RoomDetailsSlider = () => {
    const { slug } = useParams();
    const { data: roomsData, isLoading, error } = useRooms();
    const { getTranslate } = useLang();

    if (isLoading) {
        return (
            <div className="room-details__slider">
                <div className="room-details__slider-heading">
                    <h2 className="room-details__slider-heading-title">{getTranslate("roomDetails", "similarRooms")}</h2>
                </div>
                <div className="room-details__slider-loading">{getTranslate("roomDetails", "loadingSimilarRooms")}</div>
            </div>
        );
    }

    if (error || !roomsData) {
        return null;
    }

    const similarRooms = roomsData.filter(room => room.slug !== slug).slice(0, 6);

    if (similarRooms.length === 0) {
        return null;
    }

    let slidesToShow = [...similarRooms];
    const minSlidesForLoop = 2;
    
    if (slidesToShow.length < minSlidesForLoop) {
        const timesToDuplicate = Math.ceil(minSlidesForLoop / slidesToShow.length);
        const duplicated = [];
        for (let i = 0; i < timesToDuplicate; i++) {
            duplicated.push(...similarRooms);
        }
        slidesToShow = duplicated;
    }

    return (
        <div className="room-details__slider">
            <div className="room-details__slider-heading">
                <h2 className="room-details__slider-heading-title">
                    {getTranslate("roomDetails", "similarRooms")}
                </h2>
            </div>
            <div className="room-details__slider-content">
                <Swiper
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    slidesPerView={3}
                    centeredSlides={false}
                    spaceBetween={30}
                    grabCursor={true}
                    modules={[Autoplay]}
                    className="room-details__slider-container"
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        480: {
                            slidesPerView: 1,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 24,
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 30,
                        },
                    }}
                >
                    {slidesToShow.map((item, index) => (
                        <SwiperSlide key={`room-${item.id}-${index}`} className="room-details__slider-slide">
                            <div className="room-details__slider-slide-wrapper">
                                <HotelCarousel
                                    badge={getTranslate("common", "availableRoom")}
                                    title={item.title}
                                    desc={item.excerpt || item.description}
                                    src={item.poster || item.image}
                                    roomSlug={item.slug}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default RoomDetailsSlider;