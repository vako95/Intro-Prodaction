import { useRef, useEffect, memo } from "react";
import clsx from "clsx";
import { FaAngleDown } from "react-icons/fa6";
import "./FaqItem.css";

const FaqItem = memo(({ item, isOpen, onToggle, index }) => {
    const contentRef = useRef(null);
    const answerRef = useRef(null);

    useEffect(() => {
        if (!contentRef.current || !answerRef.current) return;

        requestAnimationFrame(() => {
            if (!contentRef.current || !answerRef.current) return;
            
            if (isOpen) {
                const height = answerRef.current.scrollHeight;
                contentRef.current.style.maxHeight = `${height}px`;
            } else {
                contentRef.current.style.maxHeight = '0px';
            }
        });
    }, [isOpen]);

    const handleClick = () => {
        onToggle(item.id);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle(item.id);
        }
    };

    return (
        <li
            className={clsx("faq__item", {
                "faq__item--open": isOpen
            })}
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <button
                className="faq__item-toggle"
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
            >
                <h3 className="faq__item-toggle-question">
                    {item.q}
                </h3>
                <span 
                    className="faq__item-toggle-icon"
                    aria-hidden="true"
                >
                    <FaAngleDown />
                </span>
            </button>
            
            <div
                ref={contentRef}
                className="faq__item-content"
                id={`faq-answer-${item.id}`}
                role="region"
                aria-labelledby={`faq-question-${item.id}`}
            >
                <div ref={answerRef} className="faq__item-answer">
                    {item.a}
                </div>
            </div>
        </li>
    );
});

FaqItem.displayName = 'FaqItem';

export default FaqItem;
