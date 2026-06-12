import { memo, useMemo, useState, useEffect } from "react";
import clsx from "clsx";
import "./Faq.css";
import FaqList from "./components/FaqList/FaqList.jsx";
import { useLang } from "@/hooks/useLang";
import { FaqApi } from "@/api/modules/faq";

/**
 * Distributes items evenly across columns
 * @param {Array} items - Array of FAQ items
 * @param {number} columns - Number of columns
 * @returns {Array} Array of column arrays
 */
const distributeItems = (items, columns) => {
    const itemsPerColumn = Math.ceil(items.length / columns);
    return Array.from({ length: columns }, (_, idx) => {
        const start = idx * itemsPerColumn;
        const end = start + itemsPerColumn;
        return items.slice(start, end);
    }).filter(column => column.length > 0);
};

const Faq = memo(({ columns = 2, className }) => {
    const { getTranslate } = useLang();
    const [faqItems, setFaqItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await FaqApi.getAll();
                console.log("FAQ loaded:", data);
                setFaqItems(data);
            } catch (error) {
                console.error("Failed to load FAQ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFaqs();
    }, []);
    
    const columnData = useMemo(
        () => distributeItems(faqItems, columns),
        [faqItems, columns]
    );

    const classes = clsx("faq", className);

    if (loading) {
        return null;
    }

    return (
        <section className={classes} aria-label={getTranslate("faq", "ariaLabel")}>
            {columnData.map((columnItems, idx) => (
                <div className="faq__content" key={idx}>
                    <FaqList items={columnItems} columnIndex={idx} />
                </div>
            ))}
        </section>
    );
});

Faq.displayName = 'Faq';

export default Faq;
