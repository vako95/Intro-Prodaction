import { memo, useMemo } from "react";
import { Container, DecoratedHeading } from "@components/ui";
import { AvatarPlaceholder } from "@components/ui/AvatarPlaceholder";
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import HotelRating from "../../ui/HotelRating/HotelRating";
import { useTestimonialsQuery } from "../../../hooks/useTestimonials";
import { useReviewsQuery } from "../../../hooks/useReviews";
import { useLang } from "@hooks/useLang";
import testiBg from "./assets/img/testi-bg.jpg";
import { BsChatQuote } from "react-icons/bs";

import 'swiper/css';
import 'swiper/css/pagination';
import "./Testimonial.css";

const Testimonial = () => {
    const { getTranslate } = useLang();
    const { data: testimonials, isLoading: testimonialsLoading } = useTestimonialsQuery();
    const { data: reviews, isLoading: reviewsLoading } = useReviewsQuery();

    const combinedData = useMemo(() => [
        ...(testimonials || []).map(item => ({
            id: `testimonial-${item.id}`,
            name: item.name,
            role: item.role,
            comment: item.comment,
            image: item.image,
            rating: item.rating,
            type: 'testimonial'
        })),
        ...(reviews || []).map(item => ({
            id: `review-${item.id}`,
            name: item.author?.username || item.author?.first_name || 'Anonymous',
            role: getTranslate("testimonials", "customerReview"),
            comment: item.message,
            image: item.author?.avatar || null,
            rating: item.averageRating || 5,
            type: 'review'
        }))
    ], [testimonials, reviews, getTranslate]);

    const isLoading = testimonialsLoading || reviewsLoading;

    if (isLoading) {
        return (
            <section className="testimonial">
                <div className="testimonial__backdrop" style={{ backgroundImage: `url(${testiBg})` }}>
                    <Container>
                        <div className="testimonial__container">
                            <div className="testimonial__content">
                                <div className="testimonial__heading">
                                    <DecoratedHeading
                                        position="start"
                                        showLeftIcon={false}
                                        title={getTranslate("testimonials", "whatSaysCustomer")}
                                        subtitle={getTranslate("testimonials", "whatClientsSay")}
                                    />
                                </div>
                                <div className="testimonial__slider">
                                    <div className="testimonial__placeholder">
                                        <div className="testimonial__placeholder-item">
                                            <div className="testimonial__placeholder-avatar skeleton"></div>
                                            <div className="testimonial__placeholder-content">
                                                <div className="testimonial__placeholder-rating skeleton"></div>
                                                <div className="testimonial__placeholder-text skeleton"></div>
                                                <div className="testimonial__placeholder-text skeleton"></div>
                                                <div className="testimonial__placeholder-text skeleton" style={{ width: '70%' }}></div>
                                                <div className="testimonial__placeholder-author skeleton"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        );
    }

    if (!combinedData || combinedData.length === 0) {
        return (
            <section className="testimonial">
                <div className="testimonial__backdrop" style={{ backgroundImage: `url(${testiBg})` }}>
                    <Container>
                        <div className="testimonial__container">
                            <div className="testimonial__content">
                                <div className="testimonial__heading">
                                    <DecoratedHeading
                                        position="start"
                                        showLeftIcon={false}
                                        title={getTranslate("testimonials", "whatSaysCustomer")}
                                        subtitle={getTranslate("testimonials", "whatClientsSay")}
                                    />
                                </div>
                                <div className="testimonial__slider">
                                    <p style={{ textAlign: 'center', color: '#fff', padding: '2rem' }}>
                                        {getTranslate("testimonials", "noTestimonials") || "No testimonials available"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>
        );
    }

    return (
        <section className="testimonial">
            <div className="testimonial__backdrop" style={{ backgroundImage: `url(${testiBg})` }}>
                <Container>
                    <div className="testimonial__container">
                        <div className="testimonial__content">
                            <div className="testimonial__heading">
                                <DecoratedHeading
                                    position="start"
                                    showLeftIcon={false}
                                    title={getTranslate("testimonials", "whatSaysCustomer")}
                                    subtitle={getTranslate("testimonials", "whatClientsSay")}
                                />
                            </div>
                            <div className="testimonial__slider">
                                <Swiper
                                    spaceBetween={30}
                                    speed={400}
                                    simulateTouch={true}
                                    touchRatio={1}
                                    resistance={true}
                                    resistanceRatio={0.85}
                                    pagination={{ clickable: true }}
                                    modules={[Pagination]}
                                    className="testimonial__slider-panel"
                                >
                                    {combinedData.map((item) => (
                                        <SwiperSlide className="testimonial__slider-content" key={item.id}>
                                            <div className="testimonial__slider-item">
                                                <div className="testimonial__slider-wrapper">
                                                    {item.image ? (
                                                        <img
                                                            className="testimonial__slider-wrapper-img"
                                                            src={item.image}
                                                            alt={item.name}
                                                        />
                                                    ) : (
                                                        <AvatarPlaceholder 
                                                            name={item.name} 
                                                            size="large"
                                                        />
                                                    )}
                                                </div>
                                                <div className="testimonial__slider-item-rewiew">
                                                    <div className="testimonial__slider-item-rewiew-rating">
                                                        <HotelRating rating={item.rating} />
                                                    </div>
                                                    <div className="testimonial__slider-item-rewiew-comment">
                                                        <p className="testimonial__slider-item-rewiew-comment-text">
                                                            {item.comment}
                                                        </p>
                                                        <p className="testimonial__slider-item-rewiew-comment-author">
                                                            <strong>
                                                                {item.name}
                                                            </strong>
                                                        </p>
                                                        <span className="testimonial__slider-item-rewiew-comment-role">
                                                            {item.role}
                                                        </span>
                                                        <span className="testimonial__slider-item-rewiew-comment-icon">
                                                            <BsChatQuote />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
};

export default memo(Testimonial);
