import { FaAngleDown } from "react-icons/fa6";
import "./CustomMonthsDropdown.css";
import { useState } from "react";
import { AnimationRotate, SurfacingAnimation } from "@components/animation";
import { AnimatePresence } from "framer-motion";
const CustomMonthsDropdown = ({
    options,
    value,
    onChange,
}) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggleOpen = () => setIsOpen((prev) => !prev);

    const handleSelectOption = (e) => {
        setIsOpen(false);
        onChange?.(e);
    };

    return (
        <div className="custom-months-dropdown">
            <button
                type="button"
                className="custom-months-dropdown__toggle"
                onClick={handleToggleOpen}
            >
                <span className="custom-months-dropdown__toggle-value">
                    {options[value].label}
                </span>
                <AnimationRotate isOpen={isOpen}>
                    <span className="custom-months-dropdown__toggle-icon">
                        <FaAngleDown
                            className={`custom-months-dropdown__toggle-icon 
                                ${isOpen ? "custom-months-dropdown__toggle-icon--open"
                                    : ""
                                }`}
                        />
                    </span>
                </AnimationRotate>

            </button>

            <AnimatePresence>
                {isOpen && (
                    <SurfacingAnimation key="dropdown">
                        <div className="custom-months-dropdown__content">
                            {options.map((option) => (
                                <button
                                    onClick={handleSelectOption}
                                    disabled={option.disabled}
                                    type="button"
                                    value={option.value}
                                    className="custom-months-dropdown__content-item"
                                    key={option.value}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </SurfacingAnimation>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomMonthsDropdown;