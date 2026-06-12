import { useState, useCallback, memo } from "react";
import FaqItem from "./components/FaqItem/FaqItem.jsx";
import { useLang } from "@hooks/useLang";
import "./FaqList.css";

const FaqList = memo(({ items, columnIndex }) => {
    const { getTranslate } = useLang();
    const [openId, setOpenId] = useState(null);

    const handleToggle = useCallback((id) => {
        setOpenId((prevId) => (prevId === id ? null : id));
    }, []);

    return (
        <ul 
            className="faq__list" 
            role="list"
            aria-label={`${getTranslate("faq", "column")} ${columnIndex + 1}`}
        >
            {items.map((item, index) => (
                <FaqItem
                    key={item.id}
                    item={item}
                    isOpen={openId === item.id}
                    onToggle={handleToggle}
                    index={index}
                />
            ))}
        </ul>
    );
});

FaqList.displayName = 'FaqList';

export default FaqList;
