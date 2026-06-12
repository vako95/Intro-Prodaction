import "./FacilitiesHero.css";
import { useServiceRawQuery } from "../../../../../hooks/useService.js";
import { FadeInLeft, FadeInRight } from "@components/animation";

const FacilitiesHero = () => {
    const { data: service, isLoading, isError, error } = useServiceRawQuery();

    if (isLoading) {
        return (
            <section className="facilities-hero">
                <div className="facilities-hero__container">
                    <div style={{ color: 'white', padding: '2rem' }}>Loading...</div>
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="facilities-hero">
                <div className="facilities-hero__container">
                    <div style={{ color: 'white', padding: '2rem' }}>
                        Error loading data: {error?.message || 'Unknown error'}
                    </div>
                </div>
            </section>
        );
    }

    if (!service) {
        return (
            <section className="facilities-hero">
                <div className="facilities-hero__container">
                    <div style={{ color: 'white', padding: '2rem' }}>No service data available</div>
                </div>
            </section>
        );
    }

    return (
        <section className="facilities-hero">
            <div className="facilities-hero__container">
                <FadeInLeft>
                    <div className="facilities-hero__content">
                        {service.feature?.subtitle && (
                            <span className="facilities-hero__label">
                                {service.feature.subtitle}
                            </span>
                        )}
                        
                        {service.feature?.title && (
                            <h1 className="facilities-hero__title">
                                {service.feature.title}
                            </h1>
                        )}

                        {service.feature?.content && (
                            <div 
                                className="facilities-hero__description"
                                dangerouslySetInnerHTML={{ __html: service.feature.content }}
                            />
                        )}

                        {service.feature_items && service.feature_items.length > 0 && (
                            <div className="facilities-hero__features">
                                {service.feature_items.map((item) => (
                                    <div key={item.id} className="facilities-hero__feature">
                                        {item.icon && (
                                            <div className="facilities-hero__feature-icon">
                                                <img src={item.icon} alt={item.title} />
                                            </div>
                                        )}
                                        <p className="facilities-hero__feature-text">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeInLeft>

                <FadeInRight>
                    <div className="facilities-hero__image">
                        <div className="facilities-hero__image-overlay"></div>
                        {service.cover_img && (
                            <img 
                                src={service.cover_img}
                                alt={service.title}
                                className="facilities-hero__img"
                            />
                        )}
                    </div>
                </FadeInRight>
            </div>
        </section>
    );
};

export default FacilitiesHero;
