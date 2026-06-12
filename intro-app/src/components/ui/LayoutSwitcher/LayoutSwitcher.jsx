import clsx from "clsx";
import { AiOutlineAlignLeft, AiOutlineAlignCenter, AiOutlineAlignRight } from "react-icons/ai";

import "./LayoutSwitcher.css";

const LayoutSwitcher = ({ columns, onChange }) => {
    const layouts = [
        { col: 1, icon: <AiOutlineAlignLeft /> },
        { col: 2, icon: <AiOutlineAlignCenter /> },
        { col: 3, icon: <AiOutlineAlignRight /> },
    ];


    return (
        <div className="layout-switcher">
            {layouts.map(({ col, icon }) => {
                const btnClasses = clsx(
                    "layout-switcher__btn",
                    columns === col && "active"
                )
                return (
                    <button
                        key={col}
                        className={btnClasses}
                        onClick={() => onChange(col)}
                    >
                        <span className="layout-switcher__icon">
                            {icon}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default LayoutSwitcher;
