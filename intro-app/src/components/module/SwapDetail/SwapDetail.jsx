import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SwapAPI } from "../../../api/modules/swap";
import { Container } from "@components/ui";
import Manager from "../../../state/Manager/Manager.jsx";
import Skeleton from "../../../state/Skeleton/Skeleton.jsx";
import { useLang } from "@hooks/useLang";
import "./SwapDetail.css";

const SwapDetail = () => {
    const { getTranslate } = useLang();
    const { slug } = useParams();
    const sectionRef = useRef(null);

    const { data: swap, isLoading, isError } = useQuery({
        queryKey: ["swap", slug],
        queryFn: () => SwapAPI.getOne(slug),
        enabled: Boolean(slug),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (sectionRef.current) {
            const yOffset = -100;
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }, [slug]);

    return (
        <div className="swap-detail-wrapper">
            <Container>
                <section ref={sectionRef} className="swap-detail">
                    <Manager
                        isLoading={isLoading}
                        isError={isError}
                        skeletonCustom={
                            <div className="swap-detail__skeleton">
                                <Skeleton as="div" count={1} id="swap-detail__skeleton-title" />
                                <Skeleton as="div" count={1} id="swap-detail__skeleton-image" />
                                <Skeleton as="div" count={3} id="swap-detail__skeleton-content" />
                            </div>
                        }
                        unavailableProps={{
                            title: getTranslate("messages", "error"),
                            message: getTranslate("swap", "notFound"),
                        }}
                        emptyProps={{
                            title: getTranslate("messages", "noData"),
                            description: getTranslate("swap", "noData"),
                        }}
                        items={swap ? [swap] : []}
                        renderMap={(item) => (
                            <div key={item.id} className="swap-detail__content">
                                {item.label && (
                                    <span className="swap-detail__label">{item.label}</span>
                                )}
                                <h1 className="swap-detail__title">{item.title}</h1>
                                {item.subtitle && (
                                    <h2 className="swap-detail__subtitle">{item.subtitle}</h2>
                                )}
                                {item.image && (
                                    <figure className="swap-detail__figure">
                                        <img 
                                            src={item.image} 
                                            alt={item.title}
                                            className="swap-detail__image"
                                        />
                                    </figure>
                                )}
                                {item.date && (
                                    <div className="swap-detail__meta">
                                        <span className="swap-detail__date">{item.date}</span>
                                        {item.location && (
                                            <span className="swap-detail__location">{item.location}</span>
                                        )}
                                    </div>
                                )}
                                <div 
                                    className="swap-detail__description"
                                    dangerouslySetInnerHTML={{ __html: item.content }}
                                />
                            </div>
                        )}
                    />
                </section>
            </Container>
        </div>
    );
};

export default SwapDetail;
