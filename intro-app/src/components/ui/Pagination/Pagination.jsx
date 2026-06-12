import { memo } from "react";
import clsx from "clsx";
import {
    FaAngleLeft, FaAnglesLeft,
    FaAngleRight, FaAnglesRight
} from "react-icons/fa6";
import { usePagination } from "@hooks";
import "./Pagination.css";

const Pagination = ({
    page,
    total,
    siblings,
    boundaries,
    onChange,
    className,
    currentPage, 
    totalPages, 
    onPageChange,
    isReversed, 
    ...props
}) => {
    const pagination = usePagination({
        total: total,
        siblings: siblings,
        boundaries: boundaries,
        page: page,
        initialPage: 1,
        onChange: onChange,
    });

    const classes = clsx(
        "pagination",
        className
    );

    return (
        <div className={classes} {...props}>
            <nav className="pagination__nav">
                <ul className="pagination__list">
                    <li className="pagination__item">
                        <button
                            className="pagination__button"
                            disabled={page <= 1}
                            onClick={pagination.first}
                        >
                            <FaAnglesLeft />
                        </button>
                    </li>
                    <li className="pagination__item">
                        <button
                            className="pagination__button"
                            disabled={page <= 1}
                            onClick={pagination.previous}
                        >
                            <FaAngleLeft />
                        </button>
                    </li>
                    {pagination.range.map((item, idx) => (
                        item === "dots" ? (
                            <li className="pagination__item" key={idx}>
                                <span className="pagination__ellipsis">...</span>
                            </li>
                        ) : (
                            <li className="pagination__item" key={idx}>
                                <button
                                    className={clsx(
                                        "pagination__button",
                                        item === page && "pagination__button--active"
                                    )}
                                    onClick={() => onChange?.(item)}
                                >
                                    {item}
                                </button>
                            </li>
                        )
                    ))}
                    <li className="pagination__item">
                        <button
                            className="pagination__button"
                            disabled={page >= total}
                            onClick={pagination.next}
                        >
                            <FaAngleRight />
                        </button>
                    </li>
                    <li className="pagination__item">
                        <button
                            className="pagination__button"
                            disabled={page >= total}
                            onClick={pagination.last}
                        >
                            <FaAnglesRight />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

Pagination.displayName = "ui.Pagination";
export default memo(Pagination);