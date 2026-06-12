import { useState, useEffect, memo } from "react";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { AiOutlineMinusCircle } from "react-icons/ai";
import clsx from "clsx";
import "./Quantity.css";

const Quantity = ({ onChange, initial = 0, max = 10, min = 1, className, variant, title, ...props }) => {

    const [count, setCount] = useState(initial);

    useEffect(() => {
        setCount(initial);
    }, [initial]);

    const handleOnIncrease = () => {
        setCount((prev) => {
            const count = Math.min(prev + 1, max);
            onChange(count);
            return count;
        });
    };
    const handleOnDecrease = () => {
        setCount((prev) => {
            const count = Math.max(prev - 1, min);
            onChange(count);
            return count;
        });
    };
    const classes = clsx(
        "quantity",
        variant && `quantity--${variant}`,
        className
    )

    return (
        <div className={classes} onClick={(e) => e.stopPropagation()} {...props}>
            <div className="quantity__content">
                {title && (
                    <div className="quantity__heading">
                        <h2 className="quantity__heading-title">
                            {title}
                        </h2>
                    </div>
                )}
                <div className="quantity__content-control">


                    <button
                        className="quantity__minus"
                        type="button"
                        onClick={handleOnDecrease}
                        disabled={count <= min}>
                        <span className="quantity__icon">
                            <AiOutlineMinusCircle />
                        </span>
                    </button>
                    <span className="quantity__value">
                        {count}
                    </span>
                    <input
                        className="quantity__input"
                        value={count}
                        type="text"
                        disabled
                    />
                    <button
                        className="quantity__plus"
                        type="button"
                        onClick={handleOnIncrease}
                        disabled={count >= max}
                    >
                        <span className="quantity__icon">
                            <HiOutlinePlusCircle />
                        </span>
                    </button>
                </div>
            </div>
        </div>

    )
}

export default memo(Quantity);