import { SectionWrapper, Container, DecoratedHeading } from "@components/ui";
import { LayoutSwitcher } from "@components/ui"
import "./FoodCard.css";
import FoodList from "./components/FoodList/FoodList";
import FoodItem from "./components/FoodItem/FoodItem.jsx";
import { useFoodQuery } from "../../../hooks/useFood.js";
import { useState } from "react";
import { Manager } from "../../../state/index.js";
import { useLang } from "@hooks/useLang";

const FoodCard = () => {
    const { getTranslate } = useLang();
    const [columns, setColumns] = useState(2);

    const { data: food, isLoading, isError } = useFoodQuery();

    return (
        <SectionWrapper bgColor="midnightVelvet">
            <Container>
                <section className="food-card">
                    <article className="food-card__heading">
                        <DecoratedHeading
                            title={getTranslate("food", "title")}
                            subtitle={getTranslate("food", "subtitle")}
                        />
                    </article>
                    <div className="food-card__container">
                        <div className="food-card__switcher">
                            <LayoutSwitcher columns={columns} onChange={setColumns} />
                        </div>
                        <Manager
                            isLoading={isLoading}
                            isError={isError}
                            unavailableProps={{
                                title: getTranslate("messages", "error"),
                                message: getTranslate("messages", "noData"),
                            }}
                            emptyProps={{
                                title: getTranslate("messages", "noData"),
                                message: getTranslate("messages", "noData"),
                            }}
                            skeletonProps={{
                                as: "div",
                                count: 8,
                                className: "food-card__skeleton"
                            }}
                            skeletonWrapper={FoodList}
                            items={food}
                            renderMap={(item, idx) => (
                                <FoodItem {...item} key={idx} layout={columns} item={item} />
                            )}
                            renderWrapper={(props) => (
                                <FoodList {...props} columns={columns} />
                            )}
                        />
                    </div>
                </section>
            </Container>
        </SectionWrapper>
    )
}

export default FoodCard;