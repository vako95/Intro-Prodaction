import { useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { FiDelete } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import clsx from "clsx"
import "./InputSearch.css";
import { useLang } from "@hooks/useLang";


const InputSearch = ({
    className
}) => {
    const [value, setValue] = useState("");
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { getTranslate } = useLang();
    const classes = clsx(
        "input-search",
        className
    )

    const handleSearch = () => {
        if (value.trim()) {
            navigate(`/news?search=${encodeURIComponent(value.trim())}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={classes} onClick={(e) => {
            if (e.target.tagName !== "BUTTON") inputRef.current?.focus();
        }}>

            <div className="input-search-content">
                <input
                    className="input-search__field"
                    ref={inputRef}
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={getTranslate("search", "placeholder")}
                />

                <button
                    className="input-search__clear"
                    type="button"
                    onClick={() => setValue("")}
                    disabled={!value}
                >
                    {value && (
                        <span className="input-search__clear-icon">
                            <FiDelete />
                        </span>
                    )}
                </button>
                <button 
                    className="input-search__action" 
                    type="button"
                    onClick={handleSearch}
                    disabled={!value.trim()}
                >
                    <span className="input-search__action-icon">
                        <IoSearchSharp />
                    </span>
                </button>
            </div>


        </div>
    )
}

export default InputSearch;