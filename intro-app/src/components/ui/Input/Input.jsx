import { memo, useId, useState } from "react";
import { clsx } from "clsx"
import "./Input.css";
import { FaEyeLowVision } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";
const Input = (
    {
        icon,
        showPassword = false,
        position,
        label,
        placeholder,
        type,
        brColor,
        className,
        children,
        inputProps,
        onChange,
        value,
        ...props
    }
) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handlePasswordToggle = () => {
        setIsPasswordVisible(prev => !prev);
    };

    const classes = clsx(
        "input",
        icon && "input--icon",
        showPassword && "input--show-eyes",
        brColor && "input__field--brGold ",
        isPasswordVisible && "input__icon-eyes--hidden",
        className
    )
    const inputFieldClasses = clsx(
        "input__field",
        brColor === "brGold" && "input__field--brGold"
    );

    const id = useId();

    return (
        <div className={classes} {...props}>
            <div className="input__heading">
                {label && (
                    <label className="input__label" htmlFor={`input-${id}`}>
                        {label}
                    </label>
                )}
            </div>
            <div className="input__content">
                <input
                    id={`input-${id}`}
                    placeholder={placeholder}
                    className={inputFieldClasses}
                    type={isPasswordVisible ? "text" : type}
                    value={value}
                    onChange={onChange}
                    {...inputProps}
                />
                {icon && (
                    <span className={clsx("input__icon", position && `input__icon-postion--${position}`)}>
                        {icon}
                    </span>
                )}
                {showPassword && (
                    <span onClick={handlePasswordToggle} className="input__icon-eyes ">
                        {isPasswordVisible ? (
                            <FaEyeLowVision />
                        ) : (
                            <FaRegEye />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default memo(Input);