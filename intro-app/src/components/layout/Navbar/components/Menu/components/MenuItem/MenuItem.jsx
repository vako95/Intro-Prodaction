import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./MenuItem.css";

const MenuItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    const isDropdown =
        Array.isArray(item.dropdown) &&
        item.dropdown.length > 0;

    const toggleDropdown = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const toggleSubmenu = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenSubmenu(openSubmenu === idx ? null : idx);
    };

    return (
        <li className="menu__item">
            {isDropdown ? (
                <button 
                    onClick={toggleDropdown}
                    className="menu__link menu__link--button"
                    type="button"
                >
                    <span className="menu__link-title">
                        {item.name}
                    </span>
                    <i className={`ri-arrow-down-s-line ${isOpen ? 'menu__arrow--open' : ''}`}></i>
                </button>
            ) : (
                <NavLink to={item.link} className="menu__link">
                    <span className="menu__link-title">
                        {item.name}
                    </span>
                </NavLink>
            )}

            {isDropdown && (
                <div className={`menu__subllist-wrapper ${isOpen ? 'menu__subllist-wrapper--open' : ''}`}>
                    <ul className="menu__sublist">
                    {item.dropdown.map((dropdownItem, idx) => {
                        const hasDropdown =
                            Array.isArray(dropdownItem.dropdown) &&
                            dropdownItem.dropdown.length > 0;

                        return (
                            <li
                                key={idx}
                                className="menu__sublist-item"
                            >
                                {hasDropdown ? (
                                    <button
                                        onClick={(e) => toggleSubmenu(e, idx)}
                                        className="menu__sublist-link menu__sublist-link--button"
                                        type="button"
                                    >
                                        <span className="menu__sublist-text">
                                            {dropdownItem.name}
                                        </span>
                                        <i className={`ri-arrow-down-s-line ${openSubmenu === idx ? 'menu__arrow--open' : ''}`}></i>
                                    </button>
                                ) : (
                                    <NavLink
                                        to={dropdownItem.link}
                                        className="menu__sublist-link"
                                    >
                                        <span className="menu__sublist-text">
                                            {dropdownItem.name}
                                        </span>
                                    </NavLink>
                                )}

                                {hasDropdown && openSubmenu === idx && (
                                    <ul className="menu__sublist--nested">
                                        {dropdownItem.dropdown.map((subItem) => (
                                            <li
                                                key={subItem.id}
                                                className="menu__sublist-item menu__sublist-item--nested"
                                            >
                                                <NavLink
                                                    to={subItem.link}
                                                    className="menu__sublist-link"
                                                >
                                                    <span className="menu__sublist-text">
                                                        {subItem.name}
                                                    </span>
                                                </NavLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
                </div>
                
            )}
        </li>
    );
};

export default MenuItem;