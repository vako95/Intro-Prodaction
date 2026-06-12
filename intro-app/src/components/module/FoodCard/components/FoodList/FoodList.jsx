import { clsx } from "clsx"
import "./FoodList.css";


const FoodList = ({ columns, children }) => {

    const classes = clsx(
        "food-card__list",
        `food-card__list-columns-${columns}`
    )

    return (
        <ul className={classes}>
            {children}
        </ul>

    )
}

export default FoodList;