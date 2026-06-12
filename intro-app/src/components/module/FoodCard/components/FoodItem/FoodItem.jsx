import "./FoodItem.css";
import { useState } from "react";
import { slicetext } from "@utils";
const FoodItem = ({ item, img, title, subtitle, tag, price, layout }) => {

    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMousePos({ x, y });
    };


    const layoutClass = `food-card__item-layout-${layout}`;
    return (
        <li className={`food-card__item ${layoutClass}`}>
            <article
                className="food-card__listing"
                onMouseMove={handleMove}
            >
                {layout === 1 && (
                    <>
                        <div className="food-card__fly">
                            <img
                                className="food-card__fly-img"
                                src={item.poster}
                                style={{ left: mousePos.x, top: mousePos.y }}
                                alt={item.title}
                            />
                        </div>
                        <div className="food-card__wrapper">
                            <img className="food-card__img" src={item.poster} alt={item.title} />
                        </div>
                        <div className="food-card__content">
                            <div className="food-card__headings">
                                <h5 className="food-card__title">{item.title}</h5>
                                <span className="food-card__subtitle">{item.subtitle}</span>
                            </div>
                            <div className="food-card__about">
                                <span className="food-card__about-desc"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={item.desc}
                                >
                                    {slicetext(item.desc, 124)}
                                </span>
                            </div>
                            <div className="food-card__detail">
                                <h5 className="food-card__tag">{item.tag?.[0]?.name}</h5>
                                <div className="food__card-line">
                                    <span className="food-card__price">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {layout === 2 && (
                    <>
                        <div className="food-card__fly">
                            <img
                                className="food-card__fly-img"
                                src={item.poster}
                                style={{ left: mousePos.x, top: mousePos.y }}
                                alt={item.title}
                            />
                        </div>
                        <div className="food-card__wrapper">
                            <img className="food-card__img" src={item.poster} alt={item.title} />
                        </div>
                        <div className="food-card__content">
                            <div className="food-card__headings">
                                <h5 className="food-card__title">{item.title}</h5>
                                <span className="food-card__subtitle"
                                    data-tooltip-id="my-tooltip"
                                    data-tooltip-content={item.subtitle}
                                >
                                    {slicetext(item.subtitle, 24)}
                                </span>
                            </div>
                            <div className="food-card__detail">
                                <h5 className="food-card__tag">{item.tag?.[0]?.name}</h5>
                                <div className="food__card-line">
                                    <span className="food-card__price">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {layout === 3 && (
                    <>
                        <div className="food-card__fly">
                            <img
                                className="food-card__fly-img"
                                src={item.poster}
                                style={{ left: mousePos.x, top: mousePos.y }}
                                alt={item.title}
                            />
                        </div>
                        <div className="food-card__wrapper">
                            <img className="food-card__img" src={item.poster} alt={item.title} />
                        </div>
                        <div className="food-card__content">
                            <div className="food-card__headings">
                                <h5 className="food-card__title food-card__title-sm">{item.title}</h5>
                                <span className="food-card__subtitle food-card__subtitle-sm">{item.subtitle}</span>
                            </div>
                            <div className="food-card__detail food-card__detail-sm">
                                <h5 className="food-card__tag food-card__tag-sm">{item.tag?.[0]?.name}</h5>
                                <div className="food__card-line">
                                    <span className="food-card__price food-card__price-sm">${item.price}</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </article>
        </li>
    );
};

export default FoodItem;
