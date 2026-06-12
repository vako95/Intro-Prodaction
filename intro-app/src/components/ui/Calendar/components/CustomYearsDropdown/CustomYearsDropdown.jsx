import { useState } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { AnimatePresence } from "framer-motion";
import { AnimationRotate, SurfacingAnimation } from "@components/animation";
import "./CustomYearsDropdown.css";

const CustomYearsDropdown = (
    {
        value,
        options,
        onChange,
    }) => {

    const [isOpen, setIsOpen] = useState(false);

    const handleToggleOpen = () => setIsOpen((prev) => !prev);

    const handleSelectYear = (e) => {
        setIsOpen(false)
        onChange?.(e);
    }

    return (
        <div className="custom-years-dropdown" >
            <button
                type="button"
                onClick={handleToggleOpen}
                className="custom-years-dropdown__toggle"
            >
                <span className="custom-years-dropdown__toggle-value">
                    {value}
                </span>
                <AnimationRotate isOpen={isOpen}>
                    <span className="custom-years-dropdown__toggle-icon">
                        <FaAngleDown
                            className={`custom-years-dropdown__toggle-icon
                            ${isOpen ? "custom-years-dropdown__toggle-icon--open"
                                    : ""
                                }`}
                        />
                    </span>
                </AnimationRotate>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <div className="custom-years-dropdown__content">
                        {options.map((option, idx) => (
                            <button
                                className="custom-years-dropdown__content-item"
                                key={idx}
                                disabled={option.disabled}
                                value={option.value}
                                onClick={handleSelectYear}
                                type="button"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default CustomYearsDropdown;