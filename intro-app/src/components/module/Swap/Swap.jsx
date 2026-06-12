import { Container } from "@components/ui";
import Manager from "../../../state/Manager/Manager.jsx";
import Figure from "./components/Figure/Figure.jsx";
import Content from "./components/Content/Content.jsx";
import "./Swap.css";
import Decorate from "./components/Decorate/Decorate.jsx";
import Cover from "./components/Cover/Cover.jsx";
import Skeleton from "../../../state/Skeleton/Skeleton.jsx";
import { useSwap } from "../../../hooks/useAPI.js";
import { useLang } from "@hooks/useLang";

import { Fragment } from "react";

const Swap = () => {
    const { getTranslate } = useLang();
    const { query } = useSwap();
    const { data: swap, isLoading, isError } = query;

    return (
        <section className="swap">
            <Container>
                <article className="swap__container">
                    <Manager
                        isLoading={isLoading}
                        isError={isError}
                        skeletonCustom={
                            (
                                <div className="swap__skeleton">
                                    <div className="swap__skeleton-list">
                                        <div className="swap__skeleton-item">
                                            <Skeleton as={"div"} count={"1"} id="swap__skeleton-subtitle" />
                                        </div>
                                        <div className="swap__skeleton-item">
                                            <Skeleton as={"div"} count={"1"} id="swap__skeleton-title" />
                                        </div>
                                        <div className="swap__skeleton-item">
                                            <Skeleton as={"div"} count={"1"} id="swap__skeleton-content" />
                                        </div>
                                        <div className="swap__skeleton-item">
                                            <Skeleton as={"div"} count={"1"} id="swap__skeleton-action" />
                                        </div>
                                    </div>
                                    <figure className="swap__skeleton-figure">
                                        <Skeleton as={"div"} count={"1"} id="swap__skeleton-figure-wrapper" />
                                    </figure>
                                </div>
                            )
                        }
                        unavailableProps={{
                            title: getTranslate("messages", "error"),
                            message: getTranslate("messages", "noData"),
                        }}
                        emptyProps={{
                            title: getTranslate("messages", "noData"),
                            description: getTranslate("messages", "noData"),
                        }}
                        renderWrapper={Fragment}
                        skeletonWrapper={Fragment}
                        items={swap}
                        renderMap={
                            (item) => (
                                <div key={item.id} className="swap__switcher">
                                    <Figure poster={item.poster} />
                                    <Content>
                                        <Decorate item={item} />
                                        <Cover />
                                    </Content>
                                </div>
                            )
                        }
                    />
                </article>
            </Container>
        </section >
    );
};

export default Swap;
