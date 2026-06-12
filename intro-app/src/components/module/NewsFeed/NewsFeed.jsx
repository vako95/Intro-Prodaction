import { BackdropContainer, Container, DecoratedHeading } from "@components/ui";
import bgShape from "./assets/img/backdrop/bg-shape-1.png";

import "./NewsFeed.css";
import "./NewsFeed-responsive.css";

import NewsFeedList from "./components/NewsFeedList/NewsFeedList";

import { Manager, Skeleton } from "../../../state/index.js";
import { useNewsFeedQuery } from "../../../hooks/useNewsFeed.js";
import NewsFeedItem from "./components/NewsFeedItem/NewsFeedItem.jsx";
import { Fragment } from "react";
import { useLang } from "@hooks/useLang";

const NewsFeed = () => {
    const { getTranslate } = useLang();
    const { data: newsFeed, isLoading, isError } = useNewsFeedQuery();

    return (
        <BackdropContainer position="bottom"
            backdropWidth="50%" backdropHeight="50%" backdrop={bgShape}>
            <Container>
                <section className="news-feed">
                    <div className="news-feed__container">
                        <div className="news-feed__heading">
                            <DecoratedHeading
                                title={getTranslate("news", "hotelNewsFeed")}
                                subtitle={getTranslate("news", "latestNewsUpdate")}
                            />
                        </div>
                        <div className="news-feed__content">
                            <Manager
                                isError={isError}
                                isLoading={isLoading}
                                skeletonCustom={(
                                    <div className="news-feed__skeleton">
                                        <div className="news-feed__skeleton-wrapper">
                                            <Skeleton as={"div"} count={"3"} id="news-feed__skeleton-wrapper-loading">
                                                <Skeleton as={"div"} count={"3"} id="news-feed__skeleton-wrapper-loading-time" />
                                            </Skeleton>
                                        </div>
                                        <div className="news-feed__skeleton-content">
                                            <Skeleton as={"div"} count={"3"} id="news-feed__skeleton-content-loading">
                                                <Skeleton as={"div"} count={"1"} id="news-feed__skeleton-content-loading-meta" />
                                                <Skeleton as={"div"} count={"1"} id="news-feed__skeleton-content-loading-title" />
                                            </Skeleton>
                                        </div>
                                    </div>
                                )}
                                unavailableProps={{
                                    className: "news-feed__unavailable",
                                    title: getTranslate("messages", "error"),
                                    description: getTranslate("news", "failedToLoadNews"),
                                }}
                                emptyProps={{
                                    title: getTranslate("news", "noNews"),
                                    description: getTranslate("news", "noNewsAvailable"),
                                }}
                                renderWrapper={NewsFeedList}
                                skeletonWrapper={Fragment}
                                items={newsFeed}
                                renderMap={
                                    (item) => (
                                        <NewsFeedItem
                                            key={item.id}
                                            item={item}
                                        />
                                    )
                                }
                            />
                        </div>
                    </div>
                </section >
            </Container >
        </BackdropContainer >
    )
}

export default NewsFeed;