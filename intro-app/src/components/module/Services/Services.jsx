import "./Services.css";
import { Container } from "@components/ui";
import Hero from "./components/Hero/Hero.jsx";
import Feature from "./components/Feauture/Feature.jsx";
import { Manager, Skeleton } from "@/state"
import { useServiceQuery } from "../../../hooks/useService.js"
import { Fragment } from "react";
import { useLang } from "@hooks/useLang";

const Services = () => {
    const { getTranslate } = useLang();

    const { data: service, isLoading, isError } = useServiceQuery();


    return (
        <section className="services">
            <Container>
                <Manager
                    isLoading={isLoading}
                    isError={isError}
                    unavailableProps={{
                        className: "services__unavailable",
                        title: getTranslate("messages", "error"),
                        message: getTranslate("messages", "noData"),
                    }}
                    skeletonCustom={
                        <div key="service-content" className="services__container">
                            <div className="services__section services__section--hero">
                                <div className="services-skeleton">
                                    <div className="services-skeleton__hero">
                                        <div className="services-skeleton__hero-content">
                                            <Skeleton as={"div"} count={"1"} id="services-skeleton__hero-wrapper" />
                                        </div>
                                        <div className="services-skeleton__hero-icon">
                                            <Skeleton as={"div"} count={"1"} id="services-skeleton__hero-icon-wrapper" />
                                        </div>
                                        <div className="services-skeleton__hero-card">
                                            <Skeleton as={"div"} count={"1"} id="services-skeleton__hero-card-wrapper" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="services__section services__section--future">
                                <div className="services-skeleton">
                                    <div className="services-skeleton__future">
                                        <Skeleton as={"div"} count={"4"} id="services-skeleton__future-wrapper" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                    skeletonWrapper={Fragment}
                    renderWrapper={Fragment}

                    items={service}

                    renderMap={(item) => (
                        <div key="service-content" className="services__container">

                            <div className="services__section services__section--hero">
                                <Hero item={item} />
                            </div>
                            <div className="services__section services__section--future">
                                <Feature item={item} />
                            </div>
                        </div>
                    )}
                />
            </Container>
        </section >

    )
}

export default Services;