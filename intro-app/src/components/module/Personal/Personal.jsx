import { Fragment } from "react";
import { Container, DecoratedHeading } from "@components/ui"
import { Manager, Skeleton } from "../../../state/index.js";

import { usePersonalQuery } from "../../../hooks/usePersonal.js"
import "./Personal.css";
import "./Personal-responsive.css";
import PersonalItem from "./components/PersonalItem/PersonalItem.jsx";
import PersonalList from "./components/PersonalList/PersonalList.jsx";
import { useLang } from "@hooks/useLang";

const Personal = () => {
    const { getTranslate } = useLang();
    const { data: personal, isLoading, isError } = usePersonalQuery();

    return (
        <Container>
            <section className="personal">
                <div className="personal__container">
                    <div className="personal__heading">
                        <DecoratedHeading
                            title={getTranslate("personal", "title")}
                            subtitle={getTranslate("personal", "subtitle")}
                        />
                    </div>

                    <Manager
                        isLoading={isLoading}
                        isError={isError}
                        skeletonCustom={(
                            <article className="personal-skeleton">
                                <div className="personal-skeleton__figure">
                                    <Skeleton as="div" count={4} className="personal-skeleton__figure-cover" />
                                </div>
                                <div className="skeleton-content">
                                    <Skeleton as="div" count={4} className="skeleton-content__wrapper" />
                                </div>
                            </article>
                        )}
                        unavailableProps={{
                            className: "personal__unavailable",
                            title: getTranslate("messages", "error"),
                            description: getTranslate("personal", "failedToLoad"),
                        }}
                        emptyProps={{
                            title: getTranslate("messages", "noData"),
                            description: getTranslate("personal", "noPersonal"),
                        }}
                        renderWrapper={PersonalList}
                        skeletonWrapper={Fragment}
                        items={personal}
                        renderMap={
                            (item) => (
                                <PersonalItem
                                    key={item.id}
                                    item={item}
                                />
                            )
                        }
                    />
                </div>
            </section>
        </Container>
    )
}

export default Personal;