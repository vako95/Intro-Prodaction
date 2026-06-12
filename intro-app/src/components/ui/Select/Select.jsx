
import { IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";
import { clsx } from "clsx"
import "./Select.css";
const Select = (
    {
        title,
        item,
        icon = <IoChevronDownOutline />,
        onChange,
        fontSize,
    }
) => {


    const [openOption, setOpenOption] = useState(false);
    const [value, setValue] = useState("");

    const classes = clsx(
        "select",
        fontSize && `select${fontSize}`,
        openOption && "select--open"
    )


    const handlerOption = () => {
        setOpenOption((prev) => !prev)
    }

    const handleSelect = (item) => {
        if (onChange) {
            onChange(item.value);
        }
        setValue(item.value);
        setOpenOption(false);
    }


    return (
        <div className={classes} >
            <div className="select__field" onClick={handlerOption}>
                <h1 className="select__field-title">
                    {value || title}
                </h1>
                {icon && (
                    <span className="select__field-icon">
                        {icon}
                    </span>
                )}
            </div>
            {item && item.length > 0 && (
                <div className="select__content">
                    <ul className="select__list">
                        {item.map((item, idx) => (
                            <li className="select__item" key={idx} onClick={() => handleSelect(item)}>
                                {item.value}
                            </li>
                        ))}
                    </ul>
                </div>
            )}


        </div>


    )
}

export default Select;