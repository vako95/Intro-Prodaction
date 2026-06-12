import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import "./RoomDetailsLeft.css";
import { IconMirror } from "@components/animation";
import { ICON_MAP } from "@constants";
import { WishlistButton } from "@components/ui/WishlistButton";
import { useRoomBySlug } from "../../../../../../../hooks/useAPI.js";
import { useLang } from "@hooks/useLang";
import { useBreadcrumbTitle } from "@/hooks/useBreadcrumbTitle";

const RoomDetailsLeft = () => {
    const { slug } = useParams();
    const { getTranslate } = useLang();
    const { data: roomData, isLoading, error } = useRoomBySlug(slug);
    
    useBreadcrumbTitle(roomData?.title);

    if (isLoading) {
        return (
            <article className="rooms-details__column rooms-details__columns--left">
                <div className="rooms-details__loading">{getTranslate("common", "loading")}</div>
            </article>
        );
    }

    if (error || !roomData) {
        return (
            <article className="rooms-details__column rooms-details__columns--left">
                <div className="rooms-details__error">{getTranslate("errors", "failedToLoad")}</div>
            </article>
        );
    }

    const room = roomData;
    const roomIcons = room.icons || [];


    const galleryImages = [];

    // Добавляем poster первым
    if (room.poster) {
        galleryImages.push({
            id: 'poster',
            src: room.poster
        });
    }

    // Добавляем images из бэкенда
    if (room.images && room.images.length > 0) {
        room.images.forEach(img => {
            galleryImages.push({
                id: img.id,
                src: img.image
            });
        });
    }


    if (galleryImages.length === 0) {
        galleryImages.push(
            { id: 1, src: 'https://via.placeholder.com/800x600' },
            { id: 2, src: 'https://via.placeholder.com/800x600' },
            { id: 3, src: 'https://via.placeholder.com/800x600' }
        );
    }

    return (
        <article className="rooms-details__column rooms-details__columns--left">
            <div className="rooms-details__column-showcase">
                <div className="rooms-details__column-showcase-heading">
                    <h1 className="rooms-details__column-showcase-heading-title">
                        {room.title}
                    </h1>
                    <div className="rooms-details__column-showcase-wishlist">
                        <WishlistButton roomId={room.id} />
                    </div>
                </div>
                {room.subtitle && (
                    <div className="rooms-details__column-showcase-subtitle">
                        <p>{room.subtitle}</p>
                    </div>
                )}
                <div className="rooms-details__column-showcase-overview">
                    <ul className="rooms-details__column-showcase-overview-list">
                        <li className="rooms-details__column-showcase-overview-item">
                            <span className="rooms-details__column-showcase-overview-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="rooms-details__column-showcase-overview-item-title">
                                {room.capacity_total} {getTranslate("booking", "guests")}
                            </span>
                        </li>
                        <li className="rooms-details__column-showcase-overview-item">
                            <span className="rooms-details__column-showcase-overview-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 13C6.45 13 6 13.45 6 14V20H4V12C4 10.9 4.9 10 6 10H9V7C9 5.9 9.9 5 11 5H18V3H20V5H21C21.55 5 22 5.45 22 6V11C22 11.55 21.55 12 21 12H20V20H18V14C18 13.45 17.55 13 17 13H7Z" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="rooms-details__column-showcase-overview-item-title">
                                {room.beds || 1} {(room.beds || 1) > 1 ? getTranslate("roomDetails", "beds") : getTranslate("roomDetails", "bed")}
                            </span>
                        </li>
                        <li className="rooms-details__column-showcase-overview-item">
                            <span className="rooms-details__column-showcase-overview-item-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor" />
                                    <path d="M7 10H9V12H7V10ZM11 10H13V12H11V10ZM15 10H17V12H15V10Z" fill="currentColor" />
                                </svg>
                            </span>
                            <span className="rooms-details__column-showcase-overview-item-title">
                                {room.size || 30} m²
                            </span>
                        </li>
                        {roomIcons.slice(0, 3).map((icon) => {
                            const Icon = ICON_MAP[icon.key] ?? ICON_MAP["default"];
                            return (
                                <li key={icon.id} className="rooms-details__column-showcase-overview-item">
                                    <span className="rooms-details__column-showcase-overview-item-icon">
                                        <Icon />
                                    </span>
                                    <span className="rooms-details__column-showcase-overview-item-title">
                                        {icon.label}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className="rooms-details__column-showcase-slider">
                    <Swiper
                        grabCursor={true}
                        loop={true}
                        autoplay={{
                            delay: 2500,
                        }}
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
                        modules={[Autoplay]}
                        className="rooms-details__column-showcase-slider-swiper">
                        {galleryImages.map((item, index) => (
                            <SwiperSlide key={item.id || index} className="rooms-details__column-showcase-slider-frame" >
                                <img
                                    className="slider-creative__swiper-frame-img"
                                    src={item.src || item.image || room.poster}
                                    alt={room.title}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            <div className="rooms-details__column-about">
                <div className="rooms-details__column-about-heading">
                    <h1 className="rooms-details__column-about-heading-title">
                        {getTranslate("roomDetails", "descriptionOfRoom")}
                    </h1>
                </div>
                {room.excerpt && (
                    <div className="rooms-details__column-about-body">
                        <p className="rooms-details__column-about-body-text">
                            {room.excerpt}
                        </p>
                    </div>
                )}



                {room.description && (
                    <div className="rooms-details__column-about-body">
                        <div
                            className="rooms-details__column-about-body-text"
                            dangerouslySetInnerHTML={{
                                __html: room.description
                                    .replaceAll('&nbsp;', ' ')
                                    .replaceAll('&lt;', '<')
                                    .replaceAll('&gt;', '>')
                                    .replaceAll('&quot;', '"')
                                    .replaceAll('&#39;', "'")
                                    .replaceAll('&amp;', '&'),
                            }}
                        />
                    </div>
                )}
            </div>
            {roomIcons.length > 0 && (
                <div className="rooms-details__column-features">
                    <div className="rooms-details__column-features-heading">
                        <h1 className="rooms-details__column-features-heading-title">
                            {getTranslate("roomDetails", "facilityOfRoom")}
                        </h1>
                    </div>
                    <ul className="rooms-details__column-features-list">
                        {roomIcons.map((icon) => {
                            const Icon = ICON_MAP[icon.key] ?? ICON_MAP["default"];
                            return (
                                <IconMirror key={icon.id}>
                                    <li className="rooms-details__column-features-item">
                                        <span className="rooms-details__column-features-item-icon">
                                            <Icon className="anime-mirror" />
                                        </span>
                                        <span className="rooms-details__column-features-item-title">
                                            {icon.label}
                                        </span>
                                    </li>
                                </IconMirror>
                            );
                        })}
                    </ul>
                </div>
            )}
        </article>
    );
};

export default RoomDetailsLeft;
